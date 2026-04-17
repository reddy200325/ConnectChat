import mongoose from "mongoose";

// Message schema for chat messages
const messageSchema = new mongoose.Schema(
  {
    // ID of the user who sent the message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ID of the user receiving the message
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Text message content
    text: {
      type: String,
    },

    // Image URL if message contains an image
    image: {
      type: String,
    },

     // users who deleted this message
    deletedFor: {
      type: [String],
      default: [],
    },

    // Message seen status
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically add createdAt and updatedAt
    timestamps: true,
  }
);

// Create Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;