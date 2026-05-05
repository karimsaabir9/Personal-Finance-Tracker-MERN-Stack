import Transaction from '../models/TransactionModel.js';
import User from '../models/UserModel.js';

// Add Transaction
export const addTransaction = async (req, res, next) => {
    try {
        const { title, amount, type, category, date } = req.body;
        const transaction = await Transaction.create({
            user: req.user._id,
            title,
            amount,
            type,
            category,
            date
        });

        // Update user balance
        const balanceChange = type === 'income' ? amount : -amount;
        await User.findByIdAndUpdate(req.user._id, { $inc: { balance: balanceChange } });

        res.status(201).json(transaction);
    } catch (err) {
        next(err);
    }
};

// Get All Transactions
export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        const formattedTransactions = transactions.map(t => ({
            ...t._doc,
            amount: t.type === 'expense' ? -t.amount : t.amount
        }));
        res.json(formattedTransactions);
    } catch (err) {
        next(err);
    }
};

// Update Transaction
export const updateTransaction = async (req, res, next) => {
    try {
        const oldTransaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

        if (!oldTransaction) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Update user balance based on the difference
        const oldChange = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
        const newChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        const netChange = newChange - oldChange;

        if (netChange !== 0) {
            await User.findByIdAndUpdate(req.user._id, { $inc: { balance: netChange } });
        }

        res.json(transaction);
    } catch (err) {
        next(err);
    }
};

// Delete Transaction
export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        // Revert user balance
        const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        await User.findByIdAndUpdate(req.user._id, { $inc: { balance: -balanceChange } });

        res.json({ message: 'Transaction removed' });
    } catch (err) {
        next(err);
    }
};

// Get Monthly Summary (Totals + List)
export const getMonthlySummary = async (req, res, next) => {
    try {
        const stats = await Transaction.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const income = stats.find(s => s._id === 'income')?.totalAmount || 0;
        const expense = stats.find(s => s._id === 'expense')?.totalAmount || 0;
        const balance = income - expense;

        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

        const formattedTransactions = transactions.map(t => ({
            ...t._doc,
            amount: t.type === 'expense' ? -t.amount : t.amount
        }));

        res.json({
            totalIncome: income,
            totalExpense: expense,
            totalBalance: balance,
            transactions: formattedTransactions
        });
    } catch (err) {
        next(err);
    }
};
