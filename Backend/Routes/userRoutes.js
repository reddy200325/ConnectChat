import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controller/userController.js";

import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

// ---------------- AUTH ROUTES ----------------

// Create new user account
userRouter.post("/signup", signup);

// Login existing user
userRouter.post("/login", login);

// ---------------- PROTECTED ROUTES ----------------

// Update user profile (requires authentication)
userRouter.put("/update-profile", protectRoute, updateProfile);

// Check if user is authenticated
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;