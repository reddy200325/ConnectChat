import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext);

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

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);

        setUser((prevUsers) => {
          const updated = [...prevUsers];
          const index = updated.findIndex((u) => u._id === selectedUser._id);
          if (index > -1) {
            const [chatUser] = updated.splice(index, 1);
            updated.unshift(chatUser);
          }
          return updated;
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setUser((prevUsers) => {
        const updated = [...prevUsers];
        const index = updated.findIndex((u) => u._id === newMessage.senderId);
        if (index > -1) {
          const [chatUser] = updated.splice(index, 1);
          updated.unshift(chatUser);
        }
        return updated;
      });

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch((err) => console.error(err));
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

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