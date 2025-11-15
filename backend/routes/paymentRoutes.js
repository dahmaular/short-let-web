import express from 'express';
import {
  initializePayment,
  verifyPayment,
  processRefund,
  getPaymentStatus,
  paystackWebhook
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Paystack webhook endpoint
 *     tags: [Payments]
 *     description: Receives webhook events from Paystack for payment updates
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/webhook', express.json(), paystackWebhook);

/**
 * @swagger
 * /payments/initialize:
 *   post:
 *     summary: Initialize a Paystack payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               callbackUrl:
 *                 type: string
 *                 example: https://yourapp.com/booking/confirmation
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 authorizationUrl:
 *                   type: string
 *                   example: https://checkout.paystack.com/xxxxxxxxxx
 *                 accessCode:
 *                   type: string
 *                   example: xxxxxxxxxx
 *                 reference:
 *                   type: string
 *                   example: T123456789
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/initialize', protect, initializePayment);

/**
 * @swagger
 * /payments/verify/{reference}:
 *   get:
 *     summary: Verify payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Paystack transaction reference
 *         example: T123456789
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment confirmed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/verify/:reference', protect, verifyPayment);

/**
 * @swagger
 * /payments/refund/{bookingId}:
 *   post:
 *     summary: Process refund for a booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Refund amount (optional, defaults to full amount)
 *               reason:
 *                 type: string
 *                 example: Customer request
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Refund processed successfully
 *                 refund:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/refund/:bookingId', protect, processRefund);

/**
 * @swagger
 * /payments/status/{bookingId}:
 *   get:
 *     summary: Get payment status for a booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookingId:
 *                       type: string
 *                     paymentStatus:
 *                       type: string
 *                       enum: [pending, completed, failed, refunded]
 *                     paymentMethod:
 *                       type: string
 *                     transactionId:
 *                       type: string
 *                     amount:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/status/:bookingId', protect, getPaymentStatus);

export default router;
