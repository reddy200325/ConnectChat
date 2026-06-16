import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ---------------- SIGNUP CONTROLLER ----------------
export const signup = async (req, res) => {
  try {
    let { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      userData: userResponse,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- LOGIN CONTROLLER ----------------
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

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(userData._id);

    const userResponse = userData.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      userData: userResponse,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- CHECK AUTH CONTROLLER ----------------
export const checkAuth = (req, res) => {
  if (req.user) {
    req.user.password = undefined;
  }
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ---------------- UPDATE PROFILE CONTROLLER ----------------
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    const updateFields = { bio, fullName };

    if (profilePic === null || profilePic === "") {
      updateFields.profilePic = "";
    } else if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- SEARCH USERS CONTROLLER ----------------
export const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      fullName: {
        $regex: search,
        $options: "i",
      },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.error("Search users error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};