import User from '../models/UserModel.js';
import Transaction from '../models/TransactionModel.js';

export const getAdminOverview = async (req, res, next) => {
    try {
        // Total users count
        const totalUsers = await User.countDocuments();

        // Top spending categories across all users
        const topSpendingCategories = await Transaction.aggregate([
            { $match: { type: 'expense' } },
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);

        // Recent transactions across all users
        const recentTransactions = await Transaction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                totalUsers,
                topSpendingCategories,
                recentTransactions
            }
        });
    } catch (err) {
        next(err);
    }
};
