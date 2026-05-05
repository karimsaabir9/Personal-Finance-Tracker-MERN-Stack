import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required']
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Type is required']
        },
        category: {
            type: String,
            required: [true, 'Category is required']
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
