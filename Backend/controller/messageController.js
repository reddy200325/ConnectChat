import Message from "../models/Message.js";
import User from "../models/User.js";


// ---------------- GET USERS FOR SIDEBAR ----------------
export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({
      success: true,
      users,
      unseenMessages: {},
    });

  } catch (error) {
    console.error("getUsersForSideBar error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};


// ---------------- GET MESSAGES ----------------
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("getMessages error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ---------------- SEND MESSAGE ----------------
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;

    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender or Receiver ID missing",
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image,
    });

    // ✅ IMPORTANT: update chat order timestamp (FIX REFRESH ORDER ISSUE)
    await User.updateMany(
      { _id: { $in: [senderId, receiverId] } },
      { $set: { lastMessageAt: new Date() } }
    );

    return res.status(201).json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.error("sendMessages error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ---------------- MARK AS SEEN ----------------
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        senderId,
        receiverId: userId,
        seen: false,
      },
      { $set: { seen: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as seen",
    });

  } catch (error) {
    console.error("markMessageAsSeen error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ---------------- DELETE MESSAGE ----------------
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const messageId = req.params.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const isOwner =
      message.senderId.toString() === userId.toString() ||
      message.receiverId.toString() === userId.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error("deleteMessage error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ---------------- DELETE CONVERSATION ----------------
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.id;

    await Message.deleteMany({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted",
    });

  } catch (error) {
    console.error("deleteConversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};