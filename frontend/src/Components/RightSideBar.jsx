import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/authContext";
import default_logo from "../assets/photos/default_logo.png";

const RightSideBar = ({ showSidebar, setShowSidebar }) => {
  const { authUser } = useContext(AuthContext);
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {

    const images = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);

    setMsgImages(images);

  }, [messages]);

  return selectedUser && (



    <div
      className={`
    bg-[#8185B2]/10 text-white
    w-full md:w-[320px]
    h-full md:h-screen
    fixed md:relative
    bottom-0 md:bottom-auto
    right-0
    z-50
    overflow-y-auto
    p-4 sm:p-5
    backdrop-blur-lg
    transition-all duration-300

    ${showSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0"}
  `}
    >
      {/* ---------- BACK BUTTON (MOBILE) ---------- */}
      <button
        onClick={() => setShowSidebar(false)}
        className="md:hidden absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded-full text-sm"
      >
        ← Back
      </button>

      {/* ---------- USER INFO ---------- */}
      <div className="pt-10 sm:pt-16 flex flex-col items-center gap-2 text-xs sm:text-sm font-light mx-auto">

        <img
          src={selectedUser?.profilePic || default_logo}
          alt=""
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
        />

        <h1 className="px-4 sm:px-10 text-lg sm:text-xl font-medium mx-auto flex items-center gap-2 text-center break-words">

          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}

          {selectedUser.fullName}

        </h1>

      </div>

      <hr className="border-gray-500 my-4" />

      {/* ---------- MEDIA SECTION ---------- */}
      <div className="px-2 sm:px-5 text-xs sm:text-sm">

        <p>Media</p>

        <div className="mt-2 max-h-[200px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 opacity-80">

          {msgImages.map((url, index) => (

            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >

              <img
                src={url}
                alt=""
                className="h-full w-full object-cover rounded-md"
              />

            </div>

          ))}

        </div>

      </div>

      {/* ---------- LOGOUT BUTTON ---------- */}
      <button
        onClick={logout}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2
        bg-gradient-to-r from-purple-400 to-violet-600 text-white
        border-none text-sm font-light py-2 px-10 sm:px-16 rounded-full cursor-pointer"
      >
        Logout
      </button>

    </div>

  );
};

export default RightSideBar;