import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        profilePic: String,
        balance: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

// Hashing password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

// Create model
const User = mongoose.model('User', userSchema);
export default User;