const categories = [
    'Food',
    'Rent',
    'Salary',
    'Business',
    'Investment',
    'Gift',
    'Refund',
    'Entertainment',
    'Transport',
    'Utilities',
    'Health',
    'Shopping',
    'Others'
];

export const getCategories = (req, res) => {
    res.json(categories);
};
