import React, { useContext, useEffect, useState } from "react";
import { FiArrowLeft, FiImage, FiUser, FiX } from "react-icons/fi";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/authContext";
import default_logo from "../assets/photos/default_logo.png";

const RightSideBar = ({ showSidebar, setShowSidebar }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const images = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
    setMsgImages(images);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <>
      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center">
            <FiX size={22} />
          </button>
          <img src={previewImage} alt="" className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl" />
        </div>
      )}

      {/* SIDEBAR MAIN CONTAINER */}
      <div className={`fixed md:relative top-0 right-0 z-50 h-[100dvh] md:h-screen w-full sm:w-[360px] lg:w-[400px] bg-[#0A0F1D] border-l border-white/10 text-white flex flex-col overflow-hidden transition-all duration-300 ${showSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-violet-500/[0.03] pointer-events-none" />

        {/* HEADER */}
        <div className="relative z-20 shrink-0 px-5 py-4 bg-[#141C2E]/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(false)} className="md:hidden w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] flex items-center justify-center transition-all">
              <FiArrowLeft className="text-lg" />
            </button>
            <div>
              <h2 className="text-xl font-bold">Profile Info</h2>
              <p className="text-sm text-slate-400">Chat details & media</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6">
          {/* PROFILE CARD */}
          <div className="rounded-[32px] bg-[#141C2E] border border-white/10 p-8 text-center">
            <div className="relative w-fit mx-auto">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl" />
              <img src={selectedUser.profilePic || default_logo} alt="" className="relative w-28 h-28 rounded-full object-cover border-[3px] border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,.25)]" />
            </div>

            <h1 className="mt-5 text-2xl font-bold break-words">{selectedUser.fullName}</h1>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <span className={`w-3 h-3 rounded-full ${onlineUsers?.includes(selectedUser._id) ? "bg-green-400 animate-pulse" : "bg-slate-500"}`} />
              <span className="text-sm">{onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}</span>
            </div>
          </div>

          {/* ABOUT CARD */}
          <div className="mt-6 rounded-[30px] bg-[#141C2E] border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <FiUser className="text-cyan-400 text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">About User</h3>
                <p className="text-xs text-slate-500">Bio & information</p>
              </div>
            </div>
            <p className="text-slate-300 leading-8 break-words">{selectedUser.bio || "No bio added yet."}</p>
          </div>
          
          {/* SHARED MEDIA */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                  <FiImage className="text-pink-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Shared Media</h3>
                  <p className="text-xs text-slate-500">Photos exchanged in chat</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">{msgImages.length} Files</div>
            </div>

            {msgImages.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-white/10 bg-[#141C2E] py-14 px-6 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-pink-500/10 flex items-center justify-center">
                  <FiImage className="text-3xl text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold">No Shared Media</h3>
                <p className="mt-3 text-sm text-slate-400 leading-7">Images shared in this conversation will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {msgImages.map((image, index) => (
                  <div key={index} onClick={() => setPreviewImage(image)} className="relative aspect-square overflow-hidden rounded-3xl cursor-pointer bg-[#141C2E] border border-white/10 group">
                    <img src={image} alt="" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSideBar;