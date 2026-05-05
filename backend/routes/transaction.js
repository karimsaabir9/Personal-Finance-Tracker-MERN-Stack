import express from 'express';
import { addTransaction, getTransactions, updateTransaction, deleteTransaction, getMonthlySummary } from '../controllers/transactionController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validateZod.js';
import { transactionSchema, updateTransactionSchema } from '../schemas/transactionSchema.js';

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - title
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of transactions
 */

/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     summary: Get monthly summary (Totals + List)
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Monthly summary with totals and transaction list
 */

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated
 */

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 */


const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', validate(transactionSchema), addTransaction);
router.get('/', getTransactions);
router.get('/monthly-summary', getMonthlySummary);
router.put('/:id', validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
