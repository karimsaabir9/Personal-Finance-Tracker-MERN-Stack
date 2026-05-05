import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { uploadFile } from '../controllers/uploadController.js';





/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */



const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);

export default router;
