import React, { useContext, useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiImage,
  FiUser,
} from "react-icons/fi";

import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/authContext";

import default_logo from "../assets/photos/default_logo.png";

const RightSideBar = ({
  showSidebar,
  setShowSidebar,
}) => {

  const { selectedUser, messages } =
    useContext(ChatContext);

  const { onlineUsers } =
    useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // ================= GET IMAGES =================
  useEffect(() => {

    const images = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);

    setMsgImages(images);

  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`
        fixed md:relative top-0 right-0 z-50

        h-[100dvh] md:h-screen

        w-full sm:w-[360px] lg:w-[390px]

        bg-gradient-to-b
        from-[#08101d]
        via-[#0b1525]
        to-[#101827]

        border-l border-white/5

        text-white

        flex flex-col

        overflow-hidden

        transition-all duration-300

        ${
          showSidebar
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        }
      `}
    >

      {/* ================= HEADER ================= */}
      <div
        className="
          shrink-0

          sticky top-0 z-20

          px-5 py-4

          border-b border-white/5

          bg-[#08101d]/90
          backdrop-blur-2xl
        "
      >

        <div className="flex items-center gap-3">

          {/* BACK */}
          <button
            onClick={() => setShowSidebar(false)}
            className="
              md:hidden

              w-10 h-10

              rounded-2xl

              bg-white/[0.04]
              hover:bg-white/[0.08]

              flex items-center justify-center

              transition-all duration-200
            "
          >
            <FiArrowLeft className="text-lg" />
          </button>

          {/* TITLE */}
          <div>
            <h2 className="text-xl font-bold">
              Profile Info
            </h2>

            <p className="text-sm text-gray-500 mt-0.5">
              Chat details & media
            </p>
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div
        className="
          flex-1

          overflow-y-auto

          px-5
          pt-6
          pb-4

          scrollbar-thin
          scrollbar-thumb-white/5
          scrollbar-track-transparent
        "
      >

        {/* ================= PROFILE ================= */}
        <div className="flex flex-col items-center">

          {/* IMAGE */}
          <div className="relative">

            {/* GLOW */}
            <div
              className="
                absolute inset-0

                rounded-full

                bg-cyan-500/20

                blur-3xl
              "
            />

            <img
              src={
                selectedUser?.profilePic ||
                default_logo
              }
              alt=""
              className="
                relative

                w-24 h-24
                sm:w-28 sm:h-28

                rounded-full
                object-cover

                border-[3px]
                border-cyan-400/20

                shadow-[0_0_30px_rgba(34,211,238,0.18)]
              "
            />
          </div>

          {/* NAME */}
          <h1
            className="
              mt-5

              text-2xl
              font-bold

              text-center
              break-words
            "
          >
            {selectedUser.fullName}
          </h1>

          {/* STATUS */}
          <div
            className="
              mt-3

              flex items-center gap-2

              px-4 py-2

              rounded-full

              bg-white/[0.04]
              border border-white/5
            "
          >

            <span
              className={`w-2.5 h-2.5 rounded-full ${
                onlineUsers?.includes(
                  selectedUser._id
                )
                  ? "bg-green-500 shadow-[0_0_10px_#22c55e]"
                  : "bg-gray-500"
              }`}
            />

            <p className="text-sm text-gray-300">
              {onlineUsers?.includes(
                selectedUser._id
              )
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* ================= ABOUT ================= */}
        <div
          className="
            mt-8

            rounded-[30px]

            bg-white/[0.03]
            border border-white/5

            p-6
          "
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-12 h-12

                rounded-2xl

                bg-cyan-500/10

                flex items-center justify-center
              "
            >
              <FiUser className="text-cyan-400 text-lg" />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                About User
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                User bio & information
              </p>
            </div>
          </div>

          <p
            className="
              text-[15px]
              leading-8

              text-gray-300

              break-words
            "
          >
            {selectedUser.bio ||
              "No bio added yet."}
          </p>
        </div>

        {/* ================= MEDIA ================= */}
        <div className="mt-10">

          {/* TOP */}
          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12 h-12

                  rounded-2xl

                  bg-pink-500/10

                  flex items-center justify-center
                "
              >
                <FiImage className="text-pink-400 text-lg" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Shared Media
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Photos & shared files
                </p>
              </div>
            </div>

            <span
              className="
                text-xs

                bg-white/[0.04]
                border border-white/5

                px-3 py-1.5

                rounded-full

                text-gray-300
              "
            >
              {msgImages.length} Files
            </span>
          </div>

          {/* EMPTY */}
          {msgImages.length === 0 ? (
            <div
              className="
                rounded-[32px]

                border border-dashed border-white/10

                bg-white/[0.03]

                py-16 px-6

                text-center
              "
            >

              <div
                className="
                  w-20 h-20

                  mx-auto mb-6

                  rounded-3xl

                  bg-white/[0.04]

                  flex items-center justify-center
                "
              >
                <FiImage className="text-3xl text-gray-400" />
              </div>

              <h2 className="text-2xl font-semibold">
                No Media Shared
              </h2>

              <p
                className="
                  text-sm sm:text-base

                  text-gray-500

                  mt-4
                  leading-7
                "
              >
                Photos and images shared in chat
                will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">

              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="
                    relative

                    overflow-hidden
                    rounded-2xl

                    cursor-pointer
                    group

                    border border-white/5
                    bg-white/[0.03]

                    aspect-square
                  "
                >

                  <img
                    src={url}
                    alt=""
                    className="
                      w-full h-full

                      object-cover

                      transition-all duration-500
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute inset-0

                      bg-black/0
                      group-hover:bg-black/10

                      transition-all duration-300
                    "
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;