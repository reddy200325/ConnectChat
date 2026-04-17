import React, { useContext, useState } from "react";

import ChatProcess from "../Components/ChatProcess";
import SideBar from "../Components/SideBar";
import RightSideBar from "../Components/RightSideBar";

import { ChatContext } from "../../context/ChatContext";

const HomePages = () => {

  const { selectedUser } = useContext(ChatContext);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="border w-full min-h-screen px-4 sm:px-6 md:px-[10%] xl:px-[15%] py-4 sm:py-[5%]">

      {/* Main chat layout container */}
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative
        ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >

        {/* Left Sidebar */}
        <SideBar />

        <ChatProcess setShowSidebar={setShowSidebar} />
         <RightSideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      </div>

    </div>
  );
};

export default HomePages;