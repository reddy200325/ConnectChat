import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { CiMenuKebab } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";

import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/ChatContext";

import default_logo from "../assets/photos/default_logo.png";

import axios from "axios";
import logo from "/sunochatlogo.png";

const SideBar = () => {
  const {
    user,
    setUser,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { authUser, logout, onlineUsers } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [deleteUsers, setDeleteUsers] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const menuRef = useRef();
  const pressTimer = useRef(null);
  const clickTimer = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `/api/auth/search?search=${input || ""}`
        );

        const filtered = res.data.filter(
          (u) => u._id !== authUser?._id
        );

        const sorted = [...filtered].sort((a, b) => {
          const aUnread = unseenMessages[a._id] || 0;
          const bUnread = unseenMessages[b._id] || 0;

          return bUnread - aUnread;
        });

        setUser(sorted);
      } catch (error) {
        console.log(error);
      }
    };

    if (authUser) {
      fetchUsers();
    }
  }, [input, authUser, unseenMessages]);

  const filteredUsers = input
    ? user.filter((u) =>
        u.fullName
          .toLowerCase()
          .includes(input.toLowerCase())
      )
    : user;

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
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        if (!isSelecting) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [isSelecting]);

  const handleUserClick = (u) => {
    if (isSelecting) {
      setDeleteUsers((prev) => {
        const exists = prev.find(
          (item) => item._id === u._id
        );

        return exists
          ? prev.filter(
              (item) => item._id !== u._id
            )
          : [...prev, u];
      });

      return;
    }

    if (clickTimer.current) return;

    clickTimer.current = setTimeout(() => {
      setUser((prev) => {
        const filtered = prev.filter(
          (item) => item._id !== u._id
        );

        return [u, ...filtered];
      });

      setSelectedUser(u);

      setUnseenMessages((prev) => ({
        ...prev,
        [u._id]: 0,
      }));

      clickTimer.current = null;
    }, 200);
  };

  const handleDoubleClick = (u, e) => {
    e.preventDefault();

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }

    setDeleteUsers([u]);
    setIsSelecting(true);
  };

  const handleTouchStart = (u) => {
    pressTimer.current = setTimeout(() => {
      setDeleteUsers([u]);
      setIsSelecting(true);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const handleDelete = async () => {
    try {
      const ids = deleteUsers.map((u) => u._id);

      await Promise.all(
        ids.map((id) =>
          axios.delete(
            `/api/message/conversation/${id}`
          )
        )
      );

      setUser((prev) =>
        prev.filter((u) => !ids.includes(u._id))
      );

      if (
        selectedUser &&
        ids.includes(selectedUser._id)
      ) {
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
      className={`h-screen md:h-full overflow-hidden bg-[#08101d] border-r border-white/5 text-white flex flex-col transition-all duration-300 ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="px-4 pt-4 pb-4 border-b border-white/5 shrink-0 backdrop-blur-xl">

        {/* TOP */}
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="relative shrink-0">
              <img
                src={logo}
                alt="logo"
                className="w-12 h-12 rounded-2xl object-cover border border-cyan-400/20 shadow-md shadow-cyan-500/10"
              />

              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#08101d]" />
            </div>

            <div className="overflow-hidden">
              <h2 className="truncate text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                Suno Chat
              </h2>

              <p className="text-xs text-gray-500">
                Connect instantly
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => {
                if (!isSelecting) {
                  setShowMenu((prev) => !prev);
                }
              }}
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 flex items-center justify-center transition-all duration-200"
            >
              <CiMenuKebab className="text-lg" />
            </button>

            {showMenu && (
              <div className="absolute top-14 right-0 w-44 rounded-2xl overflow-hidden bg-[#111827]/95 border border-white/5 shadow-2xl z-50 backdrop-blur-xl">

                {isSelecting ? (
                  <>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-3 text-red-400 text-sm hover:bg-red-500/10 transition-all"
                    >
                      Delete ({deleteUsers.length})
                    </button>

                    <button
                      onClick={() => {
                        setDeleteUsers([]);
                        setIsSelecting(false);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-all"
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-400 text-sm hover:bg-red-500/10 transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-5 relative">

          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            type="text"
            placeholder="Search users..."
            className="w-full bg-white/[0.04] border border-white/5 rounded-2xl pl-12 pr-4 py-3 outline-none text-sm text-white placeholder:text-gray-500 focus:border-cyan-400/40 focus:bg-white/[0.06] transition-all duration-200"
          />
        </div>
      </div>

      {/* USERS */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">

        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => {

            const isSelected =
              deleteUsers.some(
                (item) => item._id === u._id
              );

            return (
              <div
                key={u._id}
                onClick={() => handleUserClick(u)}
                onDoubleClick={(e) =>
                  handleDoubleClick(u, e)
                }
                onTouchStart={() =>
                  handleTouchStart(u)
                }
                onTouchEnd={handleTouchEnd}
                className={`group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all duration-200 active:scale-[0.985]

                ${
                  selectedUser?._id === u._id
                    ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 border-cyan-400/20 shadow-md shadow-cyan-500/5"
                    : "bg-white/[0.025] border-white/[0.04] hover:bg-white/[0.05]"
                }

                ${
                  isSelected
                    ? "bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20"
                    : ""
                }
              `}
              >
                {/* PROFILE */}
                <div className="relative shrink-0">

                  <img
                    src={
                      u?.profilePic ||
                      default_logo
                    }
                    alt=""
                    className={`w-[52px] h-[52px] rounded-2xl object-cover border transition-all duration-300
                    ${
                      isSelected
                        ? "border-red-400/40"
                        : "border-white/10"
                    }
                    `}
                  />

                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#08101d]
                    ${
                      onlineUsers?.includes(
                        u._id
                      )
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                  `}
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 overflow-hidden">

                  <div className="flex items-center justify-between gap-2">

                    <h3 className="truncate font-semibold text-sm sm:text-[15px]">
                      {u.fullName}
                    </h3>

                    {unseenMessages[u._id] >
                      0 && (
                      <div className="min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold shadow-md">
                        {
                          unseenMessages[
                            u._id
                          ]
                        }
                      </div>
                    )}
                  </div>

                  <p
                    className={`text-xs mt-1 truncate
                    ${
                      onlineUsers?.includes(
                        u._id
                      )
                        ? "text-green-400"
                        : "text-gray-500"
                    }
                  `}
                  >
                    {onlineUsers?.includes(
                      u._id
                    )
                      ? "Active now"
                      : "Offline"}
                  </p>
                </div>

                {/* SELECT OVERLAY */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-red-500/5 pointer-events-none" />
                )}
              </div>
            );
          })
        ) : (
          <div className="h-full min-h-[300px] flex items-center justify-center text-gray-500 text-sm">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;