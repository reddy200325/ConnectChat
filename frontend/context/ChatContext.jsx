import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

// Create Chat Context
export const ChatContext = createContext();

// ChatProvider manages chat-related state
export const ChatProvider = ({ children }) => {

  // Chat states
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  // Access socket and axios from AuthContext
  const { socket, axios } = useContext(AuthContext);

  // ---------------- GET USERS (SIDEBAR) ----------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUser(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- GET MESSAGES ----------------
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data.newMessage,
        ]);

        // Move current chat user to top
        setUser((prevUsers) => {
          const updatedUsers = [...prevUsers];

          const index = updatedUsers.findIndex(
            (u) => u._id === selectedUser._id
          );

          if (index > -1) {
            const [chatUser] = updatedUsers.splice(index, 1);
            updatedUsers.unshift(chatUser);
          }

          return updatedUsers;
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- SOCKET SUBSCRIBE ----------------
  const subscribeToMessages = () => {

    if (!socket) return;

    socket.on("newMessage", (newMessage) => {

      // Move sender to top of sidebar
      setUser((prevUsers) => {
        const updatedUsers = [...prevUsers];

        const index = updatedUsers.findIndex(
          (u) => u._id === newMessage.senderId
        );

        if (index > -1) {
          const [chatUser] = updatedUsers.splice(index, 1);
          updatedUsers.unshift(chatUser);
        }

        return updatedUsers;
      });

      // Current chat open
      if (
        selectedUser &&
        newMessage.senderId === selectedUser._id
      ) {
        newMessage.seen = true;

        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);

        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]:
            (prevUnseenMessages[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  // ---------------- SOCKET UNSUBSCRIBE ----------------
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // Subscribe / Unsubscribe when socket or selectedUser changes
  useEffect(() => {

    subscribeToMessages();

    return () => unsubscribeFromMessages();

  }, [socket, selectedUser]);

  // Values shared with components
  const value = {
    messages,
    user,
    selectedUser,
    getUsers,
    setUser,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};