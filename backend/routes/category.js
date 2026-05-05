import express from 'express';
import { getCategories } from '../controllers/categoryController.js';



/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 */



const router = express.Router();

router.get('/', getCategories);

export default router;
