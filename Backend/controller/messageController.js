import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Get Users For Sidebar
 */
export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .lean();

    return res.status(200).json({
      success: true,
      data: users || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/**
 * Get Chat Messages
 */
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const loggedInUserId = req.user._id;

    if (!isValidObjectId(userToChatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: messages || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/**
 * Send Message
 */
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!receiverId || !isValidObjectId(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "A valid receiver ID is required",
      });
    }

    const trimmedText = text?.trim();
    if (!trimmedText && !image) {
      return res.status(400).json({
        success: false,
        message: "Message content cannot be empty",
      });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send messages to yourself",
      });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: trimmedText || "",
      image: image || "",
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

/**
 * Mark Messages As Seen
 */
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    if (!isValidObjectId(senderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sender ID format",
      });
    }

    await Message.updateMany(
      {
        senderId,
        receiverId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as seen",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update messages",
    });
  }
};

/**
 * Delete Single Message
 */
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: messageId } = req.params;

    if (!isValidObjectId(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID format",
      });
    }

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    });

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found or unauthorized to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

/**
 * Delete Conversation
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: otherUserId } = req.params;

    if (!isValidObjectId(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const result = await Message.deleteMany({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    });

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};