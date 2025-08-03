import React, { useState, useCallback } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import Log from "../log/Log";
import Settings from "../settings/Settings";
import { LogEntry } from "../../Types";
import "./Sidebar.scss";

interface SidebarProps {
  logs: LogEntry[];
  handleFollow: (targetUserId: string) => void;
  handleUnfollow: (targetUserId: string) => void;
  followingList: string[];
  onProfileClick: () => void;
}

const Sidebar = ({
  logs,
  handleFollow,
  handleUnfollow,
  followingList,
  onProfileClick,
}: SidebarProps) => {
  const [activePanel, setActivePanel] = useState<"log" | "settings" | null>(
    null
  );

  const togglePanel = useCallback((panel: "log" | "settings") => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  }, []);

  return (
    <>
      <div className="sidebar-icon-bar">
        <div className="icon-container" onClick={onProfileClick}>
          <PersonIcon />
          <span>プロフィール</span>
        </div>
        <div className="icon-container" onClick={() => togglePanel("log")}>
          <HistoryIcon />
          <span>ログ</span>
        </div>
        <div className="icon-container" onClick={() => togglePanel("settings")}>
          <SettingsIcon />
          <span>設定</span>
        </div>
      </div>

      <div className={`sidebar-panel ${activePanel ? "is-open" : ""}`}>
        {activePanel === "log" && (
          <Log
            logs={logs}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            followingList={followingList}
          />
        )}
        {activePanel === "settings" && (
          <Settings onClose={() => setActivePanel(null)} />
        )}
      </div>
    </>
  );
};

export default Sidebar;
