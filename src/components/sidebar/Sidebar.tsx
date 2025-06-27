import React, { useState } from "react";
import "./Sidebar.scss";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import Log from "../log/Log";
import Settings from "../settings/Settings";

//サイドバー画面
const Sidebar = () => {
  const [showLog, setShowLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="sidebar">
      <div className="sidebarLeft">
        <div className="serverIcon">
          <div className="logIcon" onClick={() => setShowLog(true)}>
            <ChatBubbleOutlineIcon />
          </div>
        </div>
        <div className="sidebarFooter">
          <div className="sidebarAccount" onClick={() => setShowSettings(true)}>
            <SettingsIcon />
          </div>
        </div>
      </div>
      {showLog && <Log onClose={() => setShowLog(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Sidebar;
