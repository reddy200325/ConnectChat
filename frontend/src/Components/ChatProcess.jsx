import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BiHelpCircle } from "react-icons/bi";
import { GrGallery } from "react-icons/gr";
import { BsFillSendFill } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";

import default_logo from "../assets/photos/default_logo.png";
import { formatMessageTime } from "../lib/utils";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/ChatContext";

const ChatProcess = ({ setShowSidebar }) => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const [input, setInput] = useState("");

  // DELETE STATES
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedMsgs, setSelectedMsgs] = useState([]);

  // FIX: stable timer reference
  const pressTimer = useRef(null);

  // -------- SEND MESSAGE --------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // -------- SEND IMAGE --------
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // -------- LOAD MESSAGES --------
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // -------- AUTO SCROLL --------
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AUTO EXIT DELETE MODE
  useEffect(() => {
    if (selectedMsgs.length === 0) {
      setDeleteMode(false);
    }
  }, [selectedMsgs]);

  // -------- SELECT TOGGLE --------
  const toggleSelect = (id) => {
    setSelectedMsgs((prev) =>
      prev.includes(id)
        ? prev.filter((msg) => msg !== id)
        : [...prev, id]
    );
  };

  // -------- LONG PRESS --------
  const handleLongPressStart = (id) => {
    pressTimer.current = setTimeout(() => {
      setDeleteMode(true);
      toggleSelect(id);
    }, 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  // -------- DOUBLE CLICK --------
  const handleDoubleClick = (id) => {
    setDeleteMode(true);
    toggleSelect(id);
  };

  // -------- DELETE MESSAGE --------
  const handleDelete = async () => {
    if (selectedMsgs.length === 0) return;

    try {
      await Promise.all(
        selectedMsgs.map((id) =>
          axios.delete(`/api/message/${id}`)
        )
      );

      toast.success("Messages deleted");

      if (selectedUser?._id) {
        await getMessages(selectedUser._id);
      }

      setSelectedMsgs([]);
      setDeleteMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete messages");
    }
  };

  // -------- EMPTY SCREEN --------
  if (!selectedUser) {
    return (
      <div className="hidden md:flex items-center justify-center h-full text-white">
        <p className="text-lg">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1e2a5a] to-[#2c7da0]">

      {/* HEADER */}
      {deleteMode ? (
        <div className="flex items-center justify-between p-3 bg-red-500 text-white">
          <button
            onClick={() => {
              setDeleteMode(false);
              setSelectedMsgs([]);
            }}
          >
            Cancel
          </button>

          <p>{selectedMsgs.length} Selected</p>

          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 border-b border-white/20">

          <div
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-3 flex-1 cursor-pointer"
          >
            <img
              src={selectedUser.profilePic || default_logo}
              className="w-9 h-9 rounded-full object-cover"
            />

            <p className="text-white text-lg flex items-center gap-2">
              {selectedUser.fullName}

              {onlineUsers.includes(selectedUser._id) && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </p>
          </div>

          <IoIosArrowBack
            onClick={() => setSelectedUser(null)}
            className="md:hidden text-white text-2xl cursor-pointer"
          />

          <BiHelpCircle className="hidden md:block text-white text-xl" />
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {messages.map((msg) => (
          <div
            key={msg._id}
            onMouseDown={() => handleLongPressStart(msg._id)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onDoubleClick={() => handleDoubleClick(msg._id)}
            onTouchStart={() => handleLongPressStart(msg._id)}
            onTouchEnd={handleLongPressEnd}
            onClick={() => deleteMode && toggleSelect(msg._id)}
            className={`flex items-end gap-2 ${
              msg.senderId === authUser._id
                ? "justify-end"
                : "justify-start"
            } ${
              selectedMsgs.includes(msg._id)
                ? "bg-red-300/20 rounded-lg"
                : ""
            }`}
          >

            {!msg.image && (
              <p className={`px-3 py-2 max-w-[70%] text-sm text-white rounded-lg break-words ${
                msg.senderId === authUser._id
                  ? "bg-violet-500/40 rounded-br-none"
                  : "bg-gray-600 rounded-bl-none"
              }`}>
                {msg.text}
              </p>
            )}

            {msg.image && (
              <img
                src={msg.image}
                className="max-w-[200px] rounded-lg border border-gray-500"
              />
            )}

            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic
                    : selectedUser?.profilePic
                }
                className="w-7 h-7 rounded-full object-cover"
              />
              <p className="text-gray-300 text-[10px]">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT */}
      <div className="p-3">
        <div className="flex items-center bg-white/10 rounded-full px-3">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            placeholder="Send a Message"
            className="flex-1 bg-transparent text-white p-3 outline-none"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <GrGallery className="text-white cursor-pointer mr-2" />
          </label>

          <BsFillSendFill
            onClick={handleSendMessage}
            className="text-white cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
};

export default ChatProcess;