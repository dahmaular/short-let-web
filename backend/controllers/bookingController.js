import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      pricing,
      specialRequests
    } = req.body;

    // Check if property exists
    console.log("Property ID:", propertyId);
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check for date conflicts
    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for the selected dates'
      });
    }

    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      user: req.user.id,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      pricing,
      specialRequests,
      payment: {
        method: req.body.paymentMethod || 'card',
        status: 'pending'
      }
    });

    // Populate property details
    await booking.populate('property user');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('property')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user owns the booking or is the property host
    if (
      booking.user._id.toString() !== req.user.id &&
      booking.property.host.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason;
    booking.cancelledAt = Date.now();
    booking.cancelledBy = req.user.id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm booking (for hosts/admins)
// @route   PUT /api/bookings/:id/confirm
// @access  Private
export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the property host or admin
    if (
      booking.property.host.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this booking'
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    // Update property total bookings
    await Property.findByIdAndUpdate(booking.property._id, {
      $inc: { totalBookings: 1 }
    });

    // Update user total bookings
    await User.findByIdAndUpdate(booking.user, {
      $inc: { totalBookings: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
// @access  Private
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if checkout date has passed
    if (new Date() < booking.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete booking before checkout date'
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check availability
// @route   POST /api/bookings/check-availability
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body;

    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn }
        }
      ]
    });

    res.status(200).json({
      success: true,
      available: !existingBooking,
      message: existingBooking 
        ? 'Property is not available for the selected dates' 
        : 'Property is available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
