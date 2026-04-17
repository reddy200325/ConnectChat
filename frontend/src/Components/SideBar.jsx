import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { FcSearch } from "react-icons/fc";
import { SiRevoltdotchat } from "react-icons/si";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/ChatContext";
import default_logo from "../assets/photos/default_logo.png";
import axios from "axios";

const SideBar = () => {
  const {
    getUsers,
    user,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { authUser, logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [deleteUsers, setDeleteUsers] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const menuRef = useRef();
  const pressTimer = useRef(null);
  const clickTimer = useRef(null);

  const filteredUsers = input
    ? user.filter((u) =>
        u.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : user;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    if (isSelecting) setShowMenu(true);
  }, [isSelecting]);

  useEffect(() => {
    if (isSelecting && deleteUsers.length === 0) {
      setIsSelecting(false);
      setShowMenu(false);
    }
  }, [deleteUsers, isSelecting]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (!isSelecting) setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelecting]);

  // ================= CLICK =================
  const handleUserClick = (u) => {
    if (isSelecting) {
      setDeleteUsers((prev) => {
        const exists = prev.find((item) => item._id === u._id);
        return exists
          ? prev.filter((item) => item._id !== u._id)
          : [...prev, u];
      });
      return;
    }

    if (clickTimer.current) return;

    clickTimer.current = setTimeout(() => {
      setSelectedUser(u);
      setUnseenMessages((prev) => ({
        ...prev,
        [u._id]: 0,
      }));
      clickTimer.current = null;
    }, 200);
  };

  // ================= DOUBLE CLICK =================
  const handleDoubleClick = (u, e) => {
    e.preventDefault();

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }

    setDeleteUsers([u]);
    setIsSelecting(true);
  };

  // ================= LONG PRESS =================
  const handleTouchStart = (u) => {
    pressTimer.current = setTimeout(() => {
      setDeleteUsers([u]);
      setIsSelecting(true);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
  };

  // ================= DELETE CHAT (FIXED) =================
  const handleDelete = async () => {
    try {
      const ids = deleteUsers.map((u) => u._id);

      console.log("Deleting chats with:", ids);

      await Promise.all(
        ids.map((id) =>
           axios.delete(`/api/message/conversation/${id}`)
        )
      );

      setUsers((prev) => prev.filter((u) => !ids.includes(u._id)));

      if (selectedUser && ids.includes(selectedUser._id)) {
        setSelectedUser(null);
      }

      setUnseenMessages((prev) => {
        const updated = { ...prev };
        ids.forEach((id) => delete updated[id]);
        return updated;
      });

      setDeleteUsers([]);
      setIsSelecting(false);
      setShowMenu(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-3 sm:p-5 rounded-r-xl overflow-y-auto text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* HEADER */}
      <div className="pb-4 sm:pb-5">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-sm sm:text-base truncate">
            <SiRevoltdotchat className="logoIcon cursor-pointer" />
            Reddy
          </h3>

          <div className="relative py-2" ref={menuRef}>
            <CiMenuKebab
              onClick={() => {
                if (!isSelecting) setShowMenu((prev) => !prev);
              }}
              className="cursor-pointer"
            />

            {showMenu && (
              <div className="absolute top-full right-0 z-20 w-40 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
                {isSelecting ? (
                  <>
                    <p
                      onClick={handleDelete}
                      className="cursor-pointer text-red-400 text-sm"
                    >
                      Delete ({deleteUsers.length})
                    </p>

                    <hr className="my-2 border-gray-500" />

                    <p
                      onClick={() => {
                        setDeleteUsers([]);
                        setIsSelecting(false);
                        setShowMenu(false);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      Cancel
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      Edit Profile
                    </p>

                    <hr className="my-2 border-gray-500" />

                    <p
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      Logout
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[skyblue] rounded-full flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 mt-4 sm:mt-5">
          <FcSearch className="w-4" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search User..."
            className="bg-transparent outline-none text-white text-sm flex-1"
          />
        </div>
      </div>

      {/* USERS */}
      <div className="flex flex-col">
        {filteredUsers.map((u) => {
          const isSelected = deleteUsers.some(
            (item) => item._id === u._id
          );

          return (
            <div
              key={u._id}
              onClick={() => handleUserClick(u)}
              onDoubleClick={(e) => handleDoubleClick(u, e)}
              onTouchStart={() => handleTouchStart(u)}
              onTouchEnd={handleTouchEnd}
              className={`relative flex items-center gap-3 p-2 rounded cursor-pointer
              ${
                selectedUser?._id === u._id
                  ? "bg-[#282142]/50"
                  : ""
              }
              ${isSelected ? "bg-red-500/20" : ""}`}
            >
              <img
                src={u?.profilePic || default_logo}
                className="w-[35px] h-[35px] rounded-full object-cover"
              />

              <div className="flex flex-col truncate">
                <p className="truncate">{u.fullName}</p>

                {onlineUsers.includes(u._id) ? (
                  <span className="text-green-400 text-xs">
                    Online
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Offline
                  </span>
                )}
              </div>

              {unseenMessages[u._id] > 0 && (
                <p className="absolute top-2 right-2 text-xs bg-violet-500/50 w-5 h-5 flex items-center justify-center rounded-full">
                  {unseenMessages[u._id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;