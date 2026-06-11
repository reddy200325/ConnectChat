import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";

// ==================== SIGNUP ====================
export const signup = async (req, res) => {
  try {
    let { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    fullName = fullName.trim();
    email = email.trim().toLowerCase();
    bio = bio.trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      token,
      user: userData,
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      token,
      user: userData,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== CHECK AUTH ====================
export const checkAuth = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ==================== UPDATE PROFILE ====================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (fullName) {
      updateData.fullName = fullName.trim();
    }

    if (bio) {
      updateData.bio = bio.trim();
    }

    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ==================== SEARCH USERS ====================
export const searchUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";

    const users = await User.find({
      _id: { $ne: req.user._id },
      fullName: {
        $regex: search,
        $options: "i",
      },
    })
      .select("-password")
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      users: users || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};