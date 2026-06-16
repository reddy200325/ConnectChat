import React, { useContext, useState } from "react";

import ChatProcess from "../Components/ChatProcess";
import SideBar from "../Components/SideBar";
import RightSideBar from "../Components/RightSideBar";
import { ChatContext } from "../../context/ChatContext";

const HomePages = () => {
  const { selectedUser } = useContext(ChatContext);

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#0A0F1D] overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-cyan-500/[0.03]
          via-transparent
          to-violet-500/[0.03]
          pointer-events-none
        "
      />

      {/* MAIN LAYOUT */}
      {selectedUser ? (
        <div
          className="
            relative
            h-screen
            hidden md:grid

            grid-cols-[29%_1%_40%_1%_29%]
          "
        >
          {/* LEFT SIDEBAR */}
          <div className="h-full overflow-hidden">
            <SideBar />
          </div>

          {/* GAP */}
          <div />

          {/* CHAT */}
          <div className="h-full overflow-hidden">
            <ChatProcess
              setShowSidebar={setShowSidebar}
            />
          </div>

          {/* GAP */}
          <div />

          {/* RIGHT SIDEBAR */}
          <div className="h-full overflow-hidden">
            <RightSideBar
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />
          </div>
        </div>
      ) : (
        <div
          className="
            relative
            h-screen

            grid
            grid-cols-1

            md:grid-cols-[29%_1%_70%]
          "
        >
          {/* LEFT SIDEBAR */}
          <div className="h-full overflow-hidden">
            <SideBar />
          </div>

          {/* GAP */}
          <div className="hidden md:block" />

          {/* CHAT AREA */}
          <div className="h-full overflow-hidden">
            <ChatProcess
              setShowSidebar={setShowSidebar}
            />
          </div>
        </div>
      )}

      {/* MOBILE */}
      <div className="md:hidden h-screen">
        <ChatProcess
          setShowSidebar={setShowSidebar}
        />
      </div>
    </div>
  );
};

export default HomePages;