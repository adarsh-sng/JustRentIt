import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRoles } from "./enums.js";

const userSchema = new mongoose.Schema(
    {
        fullName: { 
            type: String, 
            required: true, 
            trim: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true, 
            index: true 
        },
        phone: { 
            type: String, 
            index: true 
        },
        role: { 
            type: String, 
            enum: Object.values(UserRoles), 
            required: true 
        },

        password: { 
            type: String, 
            required: true, 
            select: false 
        },
        refreshToken: { 
            type: String, 
            select: false 
        },

        isActive: { 
            type: Boolean, 
            default: true 
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isPasswordCorrect = async function isPasswordCorrect(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function generateAccessToken() {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );
};

userSchema.methods.generateRefreshToken = function generateRefreshToken() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
};

export const User = mongoose.model("User", userSchema);