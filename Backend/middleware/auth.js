import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect private routes
export const protectRoute = async (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.headers.token;

    // Check if token exists
    if (!token) {
      return res.json({
        success: false,
        message: "Token not found",
      });
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from database (exclude password)
    const user = await User.findById(decoded.userId).select("-password");

    // If user doesn't exist
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user data to request object
    req.user = user;

    // Continue to next middleware/controller
    next();

  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};