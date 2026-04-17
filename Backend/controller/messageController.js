import Message from "../models/Message.js";
import User from "../models/User.js";

// ---------------- GET USERS FOR SIDEBAR ----------------
export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ---------------- GET MESSAGES ----------------
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userToChatId },
        { sender: userToChatId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- SEND MESSAGES ----------------
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      image,
    });

    await newMessage.save();
    // Socket.io logic usually goes here
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- MARK AS SEEN ----------------
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const userId = req.user._id;
    await Message.updateMany(
      { sender: senderId, receiver: userId, seen: false },
      { $set: { seen: true } }
    );
    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error in markMessageAsSeen:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- DELETE SINGLE MESSAGE ----------------
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const messageId = req.params.id;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.sender.toString() !== userId.toString() && message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DELETE CONVERSATION ----------------
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.id;
    await Message.deleteMany({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    });
    res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};