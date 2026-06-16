import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ---------------- SIGNUP CONTROLLER ----------------
export const signup = async (req, res) => {
  try {
    let { fullName, email, password, bio } = req.body;

    // Normalize email
    email = email.trim().toLowerCase();

    // Validate required fields
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // Generate token
    const token = generateToken(newUser._id);

    // Remove password before sending response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      userData: userResponse,
      token,
      message: "Account created successfully",
    });

  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- LOGIN CONTROLLER ----------------
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    // Find user
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(userData._id);

    // Remove password before sending response
    const userResponse = userData.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      userData: userResponse,
      token,
      message: "Login successful",
    });

  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- CHECK AUTH CONTROLLER ----------------
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// ---------------- UPDATE PROFILE CONTROLLER ----------------
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;

    let updatedUser;

    // Without image
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          fullName,
        },
        { new: true }
      );
    } else {
      // Upload image to cloudinary
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      fullName: {
        $regex: search,
        $options: "i",
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};