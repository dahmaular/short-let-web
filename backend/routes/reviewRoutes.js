import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  addHostResponse
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review for a property
 *     tags: [Reviews]
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
 *               - bookingId
 *               - rating
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               bookingId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Amazing place! Highly recommended.
 *               categories:
 *                 type: object
 *                 properties:
 *                   cleanliness:
 *                     type: number
 *                     example: 5
 *                   accuracy:
 *                     type: number
 *                     example: 5
 *                   communication:
 *                     type: number
 *                     example: 5
 *                   location:
 *                     type: number
 *                     example: 5
 *                   checkIn:
 *                     type: number
 *                     example: 5
 *                   value:
 *                     type: number
 *                     example: 5
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                   example: Review created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /reviews/{propertyId}:
 *   get:
 *     summary: Get all reviews for a property
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
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
 *                     $ref: '#/components/schemas/Review'
 */
router.get('/:propertyId', getPropertyReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               categories:
 *                 type: object
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                   example: Review deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

/**
 * @swagger
 * /reviews/{id}/response:
 *   put:
 *     summary: Add host response to a review (Host/Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Thank you for your wonderful review!
 *     responses:
 *       200:
 *         description: Host response added successfully
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
 *                   example: Host response added successfully
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/:id/response', protect, authorize('host', 'admin'), addHostResponse);

export default router;
