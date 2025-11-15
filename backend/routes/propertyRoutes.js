import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties with filtering, sorting, and pagination
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, city
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [entire-place, private-room, shared-room]
 *         description: Filter by property type
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per night
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per night
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating (1-5)
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated amenities (e.g., WiFi,Pool,Kitchen)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Property category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (e.g., -price, rating, createdAt)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
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
 *                   example: 50
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     total:
 *                       type: integer
 *                       example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 */
router.get('/', getProperties);

/**
 * @swagger
 * /properties/featured:
 *   get:
 *     summary: Get featured properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Featured properties retrieved successfully
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
 *                     $ref: '#/components/schemas/Property'
 */
router.get('/featured', getFeaturedProperties);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get single property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getProperty);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property (Host/Admin only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - price
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Luxury Apartment in Lagos
 *               description:
 *                 type: string
 *                 example: Beautiful modern apartment
 *               type:
 *                 type: string
 *                 enum: [entire-place, private-room, shared-room]
 *                 example: entire-place
 *               price:
 *                 type: number
 *                 example: 350
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxGuests:
 *                 type: number
 *               bedrooms:
 *                 type: number
 *               beds:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', protect, authorize('host', 'admin'), createProperty);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update property (Host/Admin only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete property (Host/Admin only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
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
 *                   example: Property deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', protect, authorize('host', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('host', 'admin'), deleteProperty);

export default router;
