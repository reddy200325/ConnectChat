import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
  searchUsers,
} from "../controller/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.get("/search", searchUsers);

export default userRouter;