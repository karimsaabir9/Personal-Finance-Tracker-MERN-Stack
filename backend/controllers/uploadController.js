import User from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";


export const uploadFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    const stream = cloudinary.uploader.upload_stream({
        folder: "DugsiiyeMentorship/sabir_uploads", resource_type: "auto"
    },
        async (error, result) => {
            if (error) return next(error);

            await User.findByIdAndUpdate(req.user._id, { profilePic: result.secure_url })


            return res.status(201).json({
                success: true,
                fileUrl: result.secure_url

            })


        })

    stream.end(req.file.buffer);

}   