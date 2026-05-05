import { z } from 'zod';

export const transactionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    amount: z.number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
    }),
    type: z.enum(['income', 'expense'], {
        error_map: () => ({ message: "Type must be either 'income' or 'expense'" })
    }),
    category: z.string().min(1, 'Category is required'),
    date: z.string().optional()
});

export const updateTransactionSchema = transactionSchema.partial();
