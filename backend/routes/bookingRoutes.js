import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  confirmBooking,
  completeBooking,
  checkAvailability
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /bookings/check-availability:
 *   post:
 *     summary: Check property availability for specific dates
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - checkIn
 *               - checkOut
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-10
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-15
 *     responses:
 *       200:
 *         description: Availability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 available:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Property is available for the selected dates
 */
router.post('/check-availability', checkAvailability);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - checkIn
 *               - checkOut
 *               - guests
 *               - guestDetails
 *               - pricing
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-10
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-15
 *               guests:
 *                 type: object
 *                 properties:
 *                   adults:
 *                     type: number
 *                     example: 2
 *                   children:
 *                     type: number
 *                     example: 1
 *                   infants:
 *                     type: number
 *                     example: 0
 *               guestDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *               pricing:
 *                 type: object
 *                 properties:
 *                   pricePerNight:
 *                     type: number
 *                   nights:
 *                     type: number
 *                   subtotal:
 *                     type: number
 *                   serviceFee:
 *                     type: number
 *                   cleaningFee:
 *                     type: number
 *                   total:
 *                     type: number
 *               specialRequests:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, bank_transfer]
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *                   example: Booking created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get single booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', protect, getBooking);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               reason:
 *                 type: string
 *                 example: Change of plans
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
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
 *                   example: Booking cancelled successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/:id/cancel', protect, cancelBooking);

/**
 * @swagger
 * /bookings/{id}/confirm:
 *   put:
 *     summary: Confirm a booking (Host/Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking confirmed successfully
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
 *                   example: Booking confirmed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/:id/confirm', protect, authorize('host', 'admin'), confirmBooking);

/**
 * @swagger
 * /bookings/{id}/complete:
 *   put:
 *     summary: Mark booking as completed
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking completed successfully
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
 *                   example: Booking completed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/:id/complete', protect, completeBooking);

export default router;
