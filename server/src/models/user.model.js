import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Name is required'], 
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: { 
            type: String, 
            required: [true, 'Email is required'], 
            unique: true, 
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
            index: true 
        },
        phone: { 
            type: String, 
            trim: true,
            index: true 
        },
        address: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        pincode: {
            type: String,
            trim: true
        },
        profileImage: {
            type: String,
            default: null
        },
        password: { 
            type: String, 
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'], 
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
        { _id: this._id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "24h" }
    );
};

userSchema.methods.generateRefreshToken = function generateRefreshToken() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
};

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    return userObject;
};

export const User = mongoose.model("User", userSchema);