import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BiHelpCircle } from "react-icons/bi";
import { BsFillSendFill } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import default_logo from "../assets/photos/default_logo.png";
import { formatMessageTime } from "../lib/utils";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/ChatContext";

const ChatProcess = ({ setShowRightSidebar }) => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers, axios } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const pressTimer = useRef(null);
  const isLongPressed = useRef(false);

  const [input, setInput] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedMsgs, setSelectedMsgs] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    setTimeout(() => {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (selectedMsgs.length === 0) {
      setDeleteMode(false);
    }
  }, [selectedMsgs]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const toggleSelect = (id) => {
    setSelectedMsgs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePressStart = (id) => {
    isLongPressed.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressed.current = true;
      setDeleteMode(true);
      toggleSelect(id);
    }, 500);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const handleMessageClick = (id) => {
    if (isLongPressed.current) {
      isLongPressed.current = false;
      return;
    }
    if (deleteMode) toggleSelect(id);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedMsgs.map((id) => axios.delete(`/api/messages/message/${id}`))
      );
      toast.success("Messages deleted");
      await getMessages(selectedUser._id);
      setDeleteMode(false);
      setSelectedMsgs([]);
    } catch (error) {
      toast.error("Failed to delete messages");
    }
  };

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center h-full w-full bg-[#0A0F1D]">
        <div className="text-center text-white">
          <BsFillSendFill className="text-cyan-400 text-6xl mx-auto" />
          <h1 className="mt-6 text-3xl font-bold">Suno Chat</h1>
          <p className="text-slate-400 mt-2">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {previewImage && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute top-5 right-5 text-white">
            <IoClose size={26} />
          </button>
          <img src={previewImage} className="max-h-[90vh] max-w-[90vw] rounded-xl" alt="" />
        </div>
      )}

      <div className="flex flex-col h-screen bg-[#0A0F1D] relative overflow-hidden">
        {deleteMode ? (
          <div className="flex items-center justify-between px-5 py-4 bg-[#141C2E] border-b border-white/10 backdrop-blur-xl shrink-0 relative z-10">
            <button onClick={() => { setDeleteMode(false); setSelectedMsgs([]); }} className="text-slate-300 hover:text-white transition-colors">Cancel</button>
            <h2 className="text-white font-semibold">{selectedMsgs.length} Selected</h2>
            <button onClick={handleDelete} className="text-red-500 font-semibold hover:text-red-400 transition-colors">Delete</button>
          </div>
        ) : (
          <div className="flex items-center gap-4 px-5 py-4 bg-[#141C2E]/90 border-b border-white/10 backdrop-blur-xl shrink-0 relative z-10">
            <IoIosArrowBack onClick={(e) => { e.stopPropagation(); setSelectedUser(null); }} className="md:hidden text-white text-2xl cursor-pointer shrink-0" />

            <button type="button" onClick={() => setShowRightSidebar?.(true)} onTouchEnd={(e) => { e.stopPropagation(); setShowRightSidebar?.(true); }} className="flex items-center gap-3 flex-1 text-left outline-none min-w-0 bg-transparent border-0 p-0 cursor-pointer">
              <div className="relative shrink-0">
                <img src={selectedUser.profilePic || default_logo} className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/20" alt="" />
                {onlineUsers?.includes(selectedUser._id) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#141C2E]" />
                )}
              </div>

              <div className="overflow-hidden flex-1 pointer-events-none">
                <h2 className="text-white font-semibold truncate">{selectedUser.fullName}</h2>
                <p className={`text-xs ${onlineUsers?.includes(selectedUser._id) ? "text-green-400" : "text-slate-400"}`}>
                  {onlineUsers?.includes(selectedUser._id) ? "Active now" : "Offline"}
                </p>
              </div>
            </button>

            <BiHelpCircle className="hidden md:block text-white/70 text-2xl shrink-0" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-0 relative z-10">
          {messages.map((msg) => {
            const isMe = msg.senderId === authUser?._id || msg.senderId?._id === authUser?._id;
            const isSelected = selectedMsgs.includes(msg._id);

            return (
              <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`} onMouseDown={() => handlePressStart(msg._id)} onMouseUp={handlePressEnd} onTouchStart={() => handlePressStart(msg._id)} onTouchEnd={handlePressEnd} onClick={() => handleMessageClick(msg._id)}>
                <div className={`relative transition-all duration-300 max-w-[85vw] sm:max-w-[420px] ${isSelected ? "scale-[0.97] ring-2 ring-cyan-400 rounded-2xl" : ""}`}>
                  {msg.image && (
                    <div className={`overflow-hidden rounded-[24px] border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isMe ? "border-cyan-500/20" : "border-white/10"}`} onClick={(e) => { if (deleteMode) return; e.stopPropagation(); setPreviewImage(msg.image); }}>
                      <img src={msg.image} className="max-w-[260px] sm:max-w-[340px] object-cover" alt="" />
                    </div>
                  )}

                  {msg.text && (
                    <div className={`px-4 py-3 rounded-[24px] shadow-lg break-words transition-all duration-300 ${isMe ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-cyan-500/20" : "bg-[#141C2E] text-white border border-white/10"}`}>
                      <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  )}

                  <div className={`flex mt-1 text-[10px] text-slate-500 ${isMe ? "justify-end" : "justify-start"}`}>
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollEnd} />
        </div>

        <div className="relative z-10 p-4 border-t border-white/10 bg-[#0A0F1D]/90 backdrop-blur-xl shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <input type="file" hidden id="img" accept="image/*" onChange={handleSendImage} />
            <label htmlFor="img" className="w-12 h-12 rounded-full bg-[#141C2E] border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500/30">
              <GrGallery className="text-slate-300 text-lg" />
            </label>

            <div className="flex-1 flex items-center bg-[#141C2E] border border-white/10 rounded-full px-5 py-3 backdrop-blur-xl shadow-lg">
              <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500" placeholder="Type a message..." />
            </div>

            <button type="submit" disabled={!input.trim()} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${input.trim() ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:scale-110 active:scale-95 shadow-cyan-500/30" : "bg-[#141C2E] border border-white/10"}`}>
              <BsFillSendFill className={`text-sm ${input.trim() ? "text-white" : "text-slate-500"}`} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatProcess;