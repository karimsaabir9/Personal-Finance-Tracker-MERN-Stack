import User from "../models/UserModel.js"



//crud operations

export const createUser = async (req, res, next) => {
    try {
        const user = new User(req.body);
        const saved = await user.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        Object.assign(user, req.body);

        // Save will trigger the pre-save hook for password hashing
        const updatedUser = await user.save();
        
        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: `User with id ${id} deleted` });
    } catch (err) {
        next(err);
    }
}



