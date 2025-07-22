import { generateToken } from "../lib/utils";
import User from "../models/User";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary";

// --- Signup ---
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Account already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);
        const { password: _, ...userWithoutPassword } = newUser._doc;

        res.status(201).json({
            success: true,
            userData: userWithoutPassword,
            token,
            message: "Account created successfully",
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- Login ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);
        const { password: _, ...userWithoutPassword } = userData._doc;

        res.json({
            success: true,
            userData: userWithoutPassword,
            token,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Check Authentication ---
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// --- Update Profile ---
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;

        let updatedFields = { bio, fullName };

        if (profilePic) {
            const uploadResult = await cloudinary.uploader.upload(profilePic);
            updatedFields.profilePic = uploadResult.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Profile update failed" });
    }
};
