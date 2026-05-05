import User from '../models/UserModel.js';
import { generateToken } from '../utils/generateToken.js';


// REGISTER
export const register = async (req, res, next) => {
    let { name, email, password, role, profilePic } = req.body;
    try {
        email = email.toLowerCase();
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already in use' });

        const user = await User.create({ name, email, password, role, profilePic, balance: 0 });
        const token = generateToken(user._id);
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

// LOGIN
export const login = async (req, res, next) => {
    let { email, password } = req.body;
    try {
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                profilePic: user.profilePic,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};
