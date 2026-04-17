import mongoose from "mongoose";

// User schema definition
const userSchema = new mongoose.Schema(
  {
    // User email (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Full name of the user
    fullName: {
      type: String,
      required: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    // Profile image URL
    profilePic: {
      type: String,
      default: "",
    },

    // Short user bio
    bio: {
      type: String,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create User model
const User = mongoose.model("User", userSchema);

export default User;