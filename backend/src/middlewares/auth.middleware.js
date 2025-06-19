import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Invalid access token",
            });
        }

        const response = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(response?._id).select("-password");

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid access token",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(error.status || 500).json({
            success: true,
            message: error.message || "Invalid access token",
        });
    }
};
