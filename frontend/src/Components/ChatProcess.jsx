import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);

  const [input, setInput] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedMsgs, setSelectedMsgs] = useState([]);
  const pressTimer = useRef(null);

  // SEND TEXT
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // SEND IMAGE
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

  // LOAD MESSAGES
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  // AUTO SCROLL
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // EXIT DELETE MODE
  useEffect(() => {
    if (selectedMsgs.length === 0) setDeleteMode(false);
  }, [selectedMsgs]);

  const toggleSelect = (id) => {
    setSelectedMsgs((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleLongPressStart = (id) => {
    pressTimer.current = setTimeout(() => {
      setDeleteMode(true);
      toggleSelect(id);
    }, 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const handleDelete = async () => {
    if (!selectedMsgs.length) return;

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
      toast.error("Failed to delete messages");
    }
  };

  // EMPTY STATE
  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 h-full items-center justify-center bg-[#08101d] text-white">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
            <BsFillSendFill className="text-3xl text-cyan-400" />
          </div>

          <h2 className="text-3xl font-bold">Suno Chat</h2>
          <p className="text-gray-500 mt-3 text-lg">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh md:h-full min-h-0 overflow-hidden bg-gradient-to-b from-[#08101d] via-[#0b1525] to-[#101827]">

      {/* HEADER */}
      {deleteMode ? (
        <div className="flex items-center justify-between px-4 py-3 bg-red-500/10 border-b border-red-500/20">
          <button
            onClick={() => {
              setDeleteMode(false);
              setSelectedMsgs([]);
            }}
            className="text-white text-sm"
          >
            Cancel
          </button>

          <p className="font-semibold text-white">
            {selectedMsgs.length} Selected
          </p>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm text-white"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#08101d]/80 backdrop-blur-2xl">

          {/* BACK */}
          <IoIosArrowBack
            onClick={() => setSelectedUser(null)}
            className="md:hidden text-white text-2xl cursor-pointer"
          />

          {/* USER */}
          <div
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-3 flex-1 cursor-pointer"
          >
            <img
              src={selectedUser.profilePic || default_logo}
              className="w-11 h-11 rounded-2xl object-cover border border-white/10"
            />

            <div className="overflow-hidden">
              <h2 className="text-white font-semibold truncate">
                {selectedUser.fullName}
              </h2>

              <p
                className={`text-xs ${
                  onlineUsers?.includes(selectedUser._id)
                    ? "text-green-400"
                    : "text-gray-500"
                }`}
              >
                {onlineUsers?.includes(selectedUser._id)
                  ? "Active now"
                  : "Offline"}
              </p>
            </div>
          </div>

          <BiHelpCircle className="hidden md:block text-2xl text-white/80" />
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">

        {messages.map((msg) => {
          const isMe =
            msg.senderId === authUser._id ||
            msg.senderId?._id === authUser._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
              onMouseDown={() => handleLongPressStart(msg._id)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(msg._id)}
              onTouchEnd={handleLongPressEnd}
              onClick={() => deleteMode && toggleSelect(msg._id)}
            >
              {/* TEXT */}
              <div className="max-w-[85%] sm:max-w-[72%]">
                {msg.text && (
                  <div
                    className={`px-4 py-3 text-sm sm:text-[15px] rounded-3xl break-words ${
                      isMe
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {/* IMAGE */}
                {msg.image && (
                  <img
                    src={msg.image}
                    className="max-w-[260px] sm:max-w-[320px] rounded-3xl mt-1"
                  />
                )}

                {/* TIME */}
                <p className="text-[10px] text-gray-500 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd} />
      </div>

      {/* INPUT */}
      <div className="shrink-0 px-3 sm:px-5 py-3 border-t border-white/5 bg-[#08101d]/90">

        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSendMessage(e)
            }
            placeholder="Type message..."
            className="flex-1 bg-transparent outline-none text-white"
          />

          <input
            type="file"
            id="image"
            hidden
            onChange={handleSendImage}
          />

          <label htmlFor="image">
            <GrGallery className="text-gray-300 cursor-pointer" />
          </label>

          <button
            onClick={handleSendMessage}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center"
          >
            <BsFillSendFill className="text-white text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatProcess;