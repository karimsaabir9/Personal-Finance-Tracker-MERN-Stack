import express from 'express';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { getAdminOverview } from '../controllers/adminController.js';



/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get admin dashboard
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin dashboard
 */

/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Get admin overview
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin overview
 */



const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', (req, res) => {
    res.json({
        message: `Welcome to the admin dashboard, ${req.user.name}`
    });
});

router.get('/overview', getAdminOverview);

export default router;
