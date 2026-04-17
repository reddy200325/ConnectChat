import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Backend URL from Vite environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Set default axios base URL
axios.defaults.baseURL = backendUrl;

// Create authentication context
export const AuthContext = createContext();

// AuthProvider wraps the app and provides authentication state
export const AuthProvider = ({ children }) => {

  // Authentication state
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);

  // Online users connected through socket
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Socket instance
  const [socket, setSocket] = useState(null);

  // ---------------- CHECK AUTHENTICATION ----------------
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);

        // Connect socket after successful authentication
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ---------------- LOGIN / SIGNUP ----------------
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        // Some APIs return userData instead of user
        const user = data.userData || data.user;

        setAuthUser(user);

        // Store token in axios header
        axios.defaults.headers.common["token"] = data.token;

        // Save token in state and localStorage
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // Connect socket for real-time features
        connectSocket(user);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {

    // Remove token from storage
    localStorage.removeItem("token");

    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    // Remove axios token header
    axios.defaults.headers.common["token"] = null;

    // Disconnect socket
    if (socket) socket.disconnect();

    toast.success("Logged out successfully");
  };

  // ---------------- UPDATE PROFILE ----------------
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);

      if (data.success) {
        const updatedUser = data.user || data.userData;

        setAuthUser(updatedUser);

        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- CONNECT SOCKET ----------------
  const connectSocket = (userData) => {

    // Prevent reconnect if already connected
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    // Listen for online users from server
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // ---------------- INITIAL AUTH CHECK ----------------
  useEffect(() => {
    if (token) {
      // Attach token to axios requests
      axios.defaults.headers.common["token"] = token;

      // Verify authentication
      checkAuth();
    }
  }, [token]);

  // Values provided to context consumers
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};