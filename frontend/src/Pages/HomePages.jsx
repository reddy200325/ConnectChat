import React, { useContext, useState } from "react";

import ChatProcess from "../Components/ChatProcess";
import SideBar from "../Components/SideBar";
import RightSideBar from "../Components/RightSideBar";

import { ChatContext } from "../../context/ChatContext";

const HomePages = () => {
  const { selectedUser } = useContext(ChatContext);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="w-full min-h-dvh bg-black flex items-center justify-center">
      
      <div
        className={`
          w-full h-dvh overflow-hidden
          grid grid-cols-1 md:grid-cols-[300px_1fr]
          ${
            selectedUser
              ? "md:grid-cols-[300px_1fr_320px]"
              : ""
          }
        `}
      >

        {/* LEFT */}
        <div className="h-full min-h-0 overflow-hidden">
          <SideBar />
        </div>

        {/* CENTER */}
        <div className="h-full min-h-0 overflow-hidden">
          <ChatProcess setShowSidebar={setShowSidebar} />
        </div>

        {/* RIGHT */}
        {selectedUser && (
          <div className="h-full min-h-0 overflow-hidden">
            <RightSideBar
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePages;