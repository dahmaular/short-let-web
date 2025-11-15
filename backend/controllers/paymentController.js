import Paystack from 'paystack-api';
import Booking from '../models/Booking.js';

// Helper function to get Paystack instance
const getPaystackInstance = () => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }
  return Paystack(process.env.PAYSTACK_SECRET_KEY);
};

// @desc    Initialize payment transaction
// @route   POST /api/payments/initialize
// @access  Private
export const initializePayment = async (req, res) => {
  try {
    const { bookingId, callbackUrl } = req.body;

    // Debug logging
    console.log('Initializing payment for booking:', bookingId);
    console.log('Paystack key exists:', !!process.env.PAYSTACK_SECRET_KEY);
    console.log('Paystack key format:', process.env.PAYSTACK_SECRET_KEY?.substring(0, 8) + '...');
    
    const paystack = getPaystackInstance();

    const booking = await Booking.findById(bookingId).populate('property');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Populate user details
    await booking.populate('user');

    // Initialize payment transaction with Paystack
    const response = await paystack.transaction.initialize({
      amount: Math.round(booking.pricing.total * 100), // Convert to kobo
      email: booking.user.email,
      currency: 'NGN',
      callback_url: callbackUrl || `${process.env.FRONTEND_URL}/booking/confirmation`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        propertyId: booking.property._id.toString(),
        custom_fields: [
          {
            display_name: 'Booking ID',
            variable_name: 'booking_id',
            value: booking._id.toString()
          },
          {
            display_name: 'Property',
            variable_name: 'property_name',
            value: booking.property.title
          }
        ]
      }
    });

    // Save payment reference to booking
    booking.payment.paystackReference = response.data.reference;
    await booking.save();

    res.status(200).json({
      success: true,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: response.data.reference
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.response?.data
    });
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:reference
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Validate reference
    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment reference'
      });
    }

    const paystack = getPaystackInstance();

    // Verify payment with Paystack - The SDK expects an object with reference property
    const response = await paystack.transaction.verify({ reference });

    if (!response.status) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    const transaction = response.data;

    // Find booking by payment reference
    const booking = await Booking.findOne({ 'payment.paystackReference': reference });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (transaction.status === 'success') {
      booking.payment.status = 'completed';
      booking.payment.transactionId = transaction.id.toString();
      booking.payment.paidAt = new Date(transaction.paid_at);
      booking.status = 'confirmed';
      await booking.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        booking,
        transaction: {
          reference: transaction.reference,
          amount: transaction.amount / 100, // Convert from kobo to naira
          status: transaction.status,
          paidAt: transaction.paid_at,
          channel: transaction.channel
        }
      });
    } else {
      booking.payment.status = 'failed';
      await booking.save();

      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: transaction.status
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund/:bookingId
// @access  Private
export const processRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (booking.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund a payment that was not completed'
      });
    }

    if (!booking.payment.transactionId) {
      return res.status(400).json({
        success: false,
        message: 'No transaction ID found for this booking'
      });
    }

    const paystack = getPaystackInstance();

    // Create refund with Paystack
    const response = await paystack.refund.create({
      transaction: booking.payment.transactionId,
      amount: Math.round(booking.pricing.total * 100), // Amount in kobo
      currency: 'NGN',
      customer_note: 'Booking cancellation refund',
      merchant_note: `Refund for booking ${booking._id}`
    });

    if (response.status && response.data.status === 'pending') {
      booking.payment.status = 'refunded';
      booking.status = 'cancelled';
      booking.payment.refundReference = response.data.id;
      await booking.save();

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully. Funds will be returned within 5-7 business days.',
        refund: {
          id: response.data.id,
          status: response.data.status,
          amount: response.data.amount / 100
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Refund failed',
        error: response.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:bookingId
// @access  Private
export const getPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      payment: booking.payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Webhook for Paystack events
// @route   POST /api/payments/webhook
// @access  Public
export const paystackWebhook = async (req, res) => {
  const hash = req.headers['x-paystack-signature'];

  // Verify webhook signature
  const crypto = require('crypto');
  const computedHash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== computedHash) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;

  // Handle the event
  switch (event.event) {
    case 'charge.success':
      const transaction = event.data;
      // Update booking status
      await Booking.findOneAndUpdate(
        { 'payment.paystackReference': transaction.reference },
        {
          'payment.status': 'completed',
          'payment.transactionId': transaction.id.toString(),
          'payment.paidAt': new Date(transaction.paid_at),
          status: 'confirmed'
        }
      );
      console.log(`Payment successful for reference: ${transaction.reference}`);
      break;
    
    case 'charge.failed':
      const failedTransaction = event.data;
      await Booking.findOneAndUpdate(
        { 'payment.paystackReference': failedTransaction.reference },
        { 'payment.status': 'failed' }
      );
      console.log(`Payment failed for reference: ${failedTransaction.reference}`);
      break;

    case 'refund.processed':
      const refundData = event.data;
      await Booking.findOneAndUpdate(
        { 'payment.transactionId': refundData.transaction.toString() },
        { 
          'payment.status': 'refunded',
          status: 'cancelled'
        }
      );
      console.log(`Refund processed for transaction: ${refundData.transaction}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.event}`);
  }

  res.status(200).json({ received: true });
};
