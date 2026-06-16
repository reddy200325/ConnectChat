import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token not found",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    // Explicitly targets expired or modified token signatures safely
    return res.status(401).json({
      success: false,
      message: error.name === "JsonWebTokenError" ? "Invalid token signature" : error.message,
    });
  }
};