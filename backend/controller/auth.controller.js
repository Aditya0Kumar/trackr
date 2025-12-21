import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js"; // Import email utility
import crypto from "crypto"; // Node built-in module

export const signup = async (req, res, next) => {
    const { name, email, password, profileImageUrl, adminJoinCode } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        name === "" ||
        email === "" ||
        password === ""
    ) {
        return next(errorHandler(400, "All fields are required"));
    }

    const isAlreadyExist = await User.findOne({ email });

    if (isAlreadyExist) {
        return next(errorHandler(400, "User already exists"));
    }

    let role = "user";

    if (adminJoinCode && adminJoinCode === process.env.ADMIN_JOIN_CODE) {
        role = "admin";
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        role,
    });

    try {
        await newUser.save();

        res.json("Signup successful");
    } catch (error) {
        next(error.message);
    }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || email === "" || password === "") {
            return next(errorHandler(400, "All fields are required"));
        }

        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, "User not found!"));
        }

        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );

        if (!validPassword) {
            return next(errorHandler(400, "Wrong Credentials"));
        }

        const token = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(errorHandler(404, "User not found!"));
        }

        const { password: pass, ...rest } = user._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(errorHandler(404, "User not found!"));
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        // Add logic to update profileImageUrl
        if (req.body.profileImageUrl) {
            user.profileImageUrl = req.body.profileImageUrl;
        }

        if (req.body.password) {
            user.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await user.save();

        const { password: pass, ...rest } = updatedUser._doc; // Use updatedUser._doc here

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(errorHandler(400, "No file uploaded"));
        }

        const imageUrl = `${req.protocol}://${req.get("host")}/assets/uploads/${
            req.file.filename
        }`;

        res.status(200).json({ imageUrl });
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token")
            .status(200)
            .json("User has been loggedout successfully!");
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(errorHandler(400, "Email is required"));
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Send a generic success message even if the user doesn't exist to prevent email enumeration
            return res.status(200).json({ message: "If a matching account was found, a password reset email has been sent." });
        }

        // Generate a secure, time-limited token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 3600000; // 1 hour expiry

        // Store the token and expiry on the user object (requires updating the User model)
        // For now, we will use JWT to generate a temporary token that contains the user ID
        const jwtToken = jwt.sign({ id: user._id, reset: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const resetUrl = `${process.env.FRONT_END_URL}/reset-password/${jwtToken}`;

        const emailContent = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your Trackr account.</p>
            <p>Please click the link below to reset your password. This link is valid for 1 hour:</p>
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        await sendEmail(user.email, "Trackr Password Reset Request", emailContent);

        res.status(200).json({ message: "If a matching account was found, a password reset email has been sent." });

    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return next(errorHandler(400, "New password is required"));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return next(errorHandler(400, "Invalid or expired reset token."));
        }

        if (!decoded.reset || !decoded.id) {
            return next(errorHandler(400, "Invalid token payload."));
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(errorHandler(404, "User not found."));
        }

        // Update password
        user.password = bcryptjs.hashSync(password, 10);
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });

    } catch (error) {
        next(error);
    }
};