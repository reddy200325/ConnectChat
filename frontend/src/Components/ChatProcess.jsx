import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { IoIosArrowBack } from "react-icons/io";
import { BiHelpCircle } from "react-icons/bi";
import { BsFillSendFill } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { IoClose } from "react-icons/io5";

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
  const pressTimer = useRef(null);

  const [input, setInput] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedMsgs, setSelectedMsgs] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // ---------------- LOAD CHAT ----------------
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    setTimeout(() => {
      scrollEnd.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }, [messages]);

  // ---------------- EXIT DELETE MODE ----------------
  useEffect(() => {
    if (selectedMsgs.length === 0) {
      setDeleteMode(false);
    }
  }, [selectedMsgs]);

  // ---------------- SEND TEXT ----------------
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input.trim(),
    });

    setInput("");
  };

  // ---------------- SEND IMAGE ----------------
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({
        image: reader.result,
      });

      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // ---------------- SELECT MESSAGE ----------------
  const toggleSelect = (id) => {
    setSelectedMsgs((prev) =>
      prev.includes(id)
        ? prev.filter((msgId) => msgId !== id)
        : [...prev, id]
    );
  };

  // ---------------- LONG PRESS ----------------
  const handleLongPressStart = (id) => {
    pressTimer.current = setTimeout(() => {
      setDeleteMode(true);
      toggleSelect(id);
    }, 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedMsgs.map((id) =>
          axios.delete(`/api/message/${id}`)
        )
      );

      toast.success("Messages deleted");

      await getMessages(selectedUser._id);

      setDeleteMode(false);
      setSelectedMsgs([]);
    } catch (error) {
      toast.error("Failed to delete messages");
    }
  };

  // ---------------- EMPTY STATE ----------------
  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-[#0A0F1D] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />

        <div className="relative text-center">
          <div
            className="
              w-32
              h-32
              mx-auto
              rounded-[32px]
              border
              border-cyan-500/20
              bg-gradient-to-br
              from-cyan-500/10
              to-violet-500/10
              flex
              items-center
              justify-center
              backdrop-blur-xl
              shadow-2xl
            "
          >
            <BsFillSendFill className="text-cyan-400 text-5xl" />
          </div>

          <h1 className="mt-8 text-4xl font-bold text-white">
            Suno Chat
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Select a conversation and start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-black/90
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-4
          "
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="
              absolute
              top-5
              right-5
              w-12
              h-12
              rounded-full
              bg-white/10
              text-white
              flex
              items-center
              justify-center
            "
          >
            <IoClose size={24} />
          </button>

          <img
            src={previewImage}
            alt=""
            className="
              max-h-[90vh]
              max-w-[90vw]
              rounded-3xl
              shadow-2xl
            "
          />
        </div>
      )}

      <div
        className="
          flex
          flex-col
          h-dvh
          md:h-full
          bg-[#0A0F1D]
          relative
          overflow-hidden
        "
      >
        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] via-transparent to-violet-500/[0.03]" />

        {/* HEADER */}
        {deleteMode ? (
          <div
            className="
              relative
              z-10
              flex
              items-center
              justify-between
              px-5
              py-4
              bg-[#141C2E]
              border-b
              border-white/10
              backdrop-blur-xl
            "
          >
            <button
              onClick={() => {
                setDeleteMode(false);
                setSelectedMsgs([]);
              }}
              className="text-slate-300 hover:text-white"
            >
              Cancel
            </button>

            <h2 className="text-white font-semibold">
              {selectedMsgs.length} Selected
            </h2>

            <button
              onClick={handleDelete}
              className="
                px-5
                py-2
                rounded-full
                bg-red-500
                hover:bg-red-600
                text-white
                transition-all
              "
            >
              Delete
            </button>
          </div>
        ) : (
          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-4
              px-5
              py-4
              bg-[#141C2E]/90
              border-b
              border-white/10
              backdrop-blur-xl
            "
          >
            <IoIosArrowBack
              onClick={() => setSelectedUser(null)}
              className="
                md:hidden
                text-white
                text-2xl
                cursor-pointer
              "
            />

            <div
              onClick={() => setShowSidebar(true)}
              className="
                flex
                items-center
                gap-3
                flex-1
                cursor-pointer
              "
            >
              <div className="relative">
                <img
                  src={
                    selectedUser.profilePic ||
                    default_logo
                  }
                  alt=""
                  className="
                    w-12
                    h-12
                    rounded-full
                    object-cover
                    border-2
                    border-cyan-500/20
                  "
                />

                {onlineUsers?.includes(
                  selectedUser._id
                ) && (
                  <span
                    className="
                      absolute
                      bottom-0
                      right-0
                      w-3.5
                      h-3.5
                      bg-green-400
                      rounded-full
                      border-2
                      border-[#141C2E]
                    "
                  />
                )}
              </div>

              <div className="overflow-hidden">
                <h2 className="font-semibold text-white truncate">
                  {selectedUser.fullName}
                </h2>

                <p
                  className={`text-xs ${
                    onlineUsers?.includes(
                      selectedUser._id
                    )
                      ? "text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  {onlineUsers?.includes(
                    selectedUser._id
                  )
                    ? "Active now"
                    : "Offline"}
                </p>
              </div>
            </div>

            <BiHelpCircle
              className="
                hidden
                md:block
                text-white/70
                text-2xl
              "
            />
          </div>
        )}
                {/* MESSAGES */}
        <div
          className="
            relative
            z-10
            flex-1
            overflow-y-auto
            px-4
            py-5
            space-y-4
            min-h-0
          "
        >
          {messages.map((msg) => {
            const isMe =
              msg.senderId === authUser?._id ||
              msg.senderId?._id === authUser?._id;

            const isSelected =
              selectedMsgs.includes(msg._id);

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
                onMouseDown={() =>
                  handleLongPressStart(msg._id)
                }
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() =>
                  handleLongPressStart(msg._id)
                }
                onTouchEnd={handleLongPressEnd}
                onClick={() =>
                  deleteMode &&
                  toggleSelect(msg._id)
                }
              >
                <div
                  className={`
                    relative
                    transition-all
                    duration-300
                    ${
                      isSelected
                        ? "scale-[0.97] ring-2 ring-cyan-400"
                        : ""
                    }
                  `}
                >
                  {/* IMAGE MESSAGE */}
                  {msg.image && (
                    <div
                      className={`
                        overflow-hidden
                        rounded-[24px]
                        border
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:scale-[1.02]
                        ${
                          isMe
                            ? "border-cyan-500/20"
                            : "border-white/10"
                        }
                      `}
                      onClick={(e) => {
                        if (deleteMode) return;
                        e.stopPropagation();
                        setPreviewImage(msg.image);
                      }}
                    >
                      <img
                        src={msg.image}
                        alt=""
                        className="
                          max-w-[260px]
                          sm:max-w-[340px]
                          object-cover
                        "
                      />
                    </div>
                  )}

                  {/* TEXT MESSAGE */}
                  {msg.text && (
                    <div
                      className={`
                        px-4
                        py-3
                        rounded-[24px]
                        shadow-lg
                        break-words
                        max-w-[85vw]
                        sm:max-w-[420px]
                        transition-all
                        duration-300
                        ${
                          isMe
                            ? `
                              bg-gradient-to-br
                              from-cyan-500
                              via-blue-500
                              to-indigo-600
                              text-white
                              shadow-cyan-500/20
                            `
                            : `
                              bg-[#141C2E]
                              text-white
                              border
                              border-white/10
                            `
                        }
                      `}
                    >
                      <p
                        className="
                          text-sm
                          sm:text-[15px]
                          leading-relaxed
                          whitespace-pre-wrap
                        "
                      >
                        {msg.text}
                      </p>
                    </div>
                  )}

                  {/* TIME */}
                  <div
                    className={`
                      flex
                      mt-1
                      text-[10px]
                      text-slate-500
                      ${
                        isMe
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >
                    {formatMessageTime(
                      msg.createdAt
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={scrollEnd} />
        </div>
                {/* INPUT AREA */}
        <div
          className="
            relative
            z-10
            p-4
            border-t
            border-white/10
            bg-[#0A0F1D]/90
            backdrop-blur-xl
          "
        >
          <form
            onSubmit={handleSendMessage}
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* IMAGE PICKER */}
            <input
              type="file"
              id="chat-image"
              hidden
              accept="image/*"
              onChange={handleSendImage}
            />

            <label
              htmlFor="chat-image"
              className="
                w-12
                h-12
                rounded-full
                bg-[#141C2E]
                border
                border-white/10
                flex
                items-center
                justify-center
                cursor-pointer
                transition-all
                duration-300
                hover:scale-105
                hover:border-cyan-500/30
              "
            >
              <GrGallery
                className="
                  text-slate-300
                  text-lg
                "
              />
            </label>

            {/* INPUT BOX */}
            <div
              className="
                flex-1
                flex
                items-center
                bg-[#141C2E]
                border
                border-white/10
                rounded-full
                px-5
                py-3
                backdrop-blur-xl
                shadow-lg
              "
            >
              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder="Type a message..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-white
                  placeholder:text-slate-500
                "
              />
            </div>

            {/* SEND BUTTON */}
            <button
              type="submit"
              disabled={!input.trim()}
              className={`
                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                transition-all
                duration-300
                shadow-lg
                ${
                  input.trim()
                    ? `
                      bg-gradient-to-r
                      from-cyan-500
                      via-blue-500
                      to-violet-600
                      hover:scale-110
                      active:scale-95
                      shadow-cyan-500/30
                    `
                    : `
                      bg-[#141C2E]
                      border
                      border-white/10
                    `
                }
              `}
            >
              <BsFillSendFill
                className={`
                  text-sm
                  ${
                    input.trim()
                      ? "text-white"
                      : "text-slate-500"
                  }
                `}
              />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatProcess;