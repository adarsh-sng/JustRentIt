import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const sendTokens = async (user, res) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
    
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
    
        return res
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
            .cookie("refreshToken", refreshToken, cookieOptions)
            .status(200)
            .json(new ApiResponse(200, { user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } }, "Login successful"));
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

export const register = asyncHandler(async (req, res) => {
    const { fullName, email, password, role, phone } = req.body;

    if (!fullName || !email || !password || !role) {
        throw new ApiError(400, "fullName, email, role and password are required");
    }

    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already registered");

    const user = await User.create({ fullName, email, password, role, phone });
    return res.status(201).json(new ApiResponse(201, { id: user._id }, "Registered"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user) throw new ApiError(404, "Invalid credentials");

    const ok = await user.isPasswordCorrect(password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    return sendTokens(user, res);
});

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out"));
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, user));
});

export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) throw new ApiError(401, "No refresh token");

    const user = await User.findOne({ refreshToken: token }).select("+refreshToken");
    if (!user) throw new ApiError(401, "Invalid refresh token");
    
    return sendTokens(user, res);
});