import React, { useState, useCallback } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Log from "../log/Log";
import Settings from "../settings/Settings";
import { LogEntry } from "../../Types";
import "./Sidebar.scss";
import { useAppDispatch } from "../../app/hooks";
import { addDirection, removeDirection } from "../../features/controlsSlice";
import { Direction } from "../graphics/types/common";

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
  const [isDPadVisible, setIsDPadVisible] = useState(false);
  const dispatch = useAppDispatch();

  const togglePanel = useCallback((panel: "log" | "settings") => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  }, []);

  const handleMoveStart = (direction: Direction) => {
    dispatch(addDirection(direction));
  };

  const handleMoveEnd = (direction: Direction) => {
    dispatch(removeDirection(direction));
  };

  return (
    <>
      <div className="sidebar-icon-bar">
        <div className="sidebar-main-icons">
          <div className="icon-container" onClick={onProfileClick}>
            <PersonIcon />
            <span>プロフィール</span>
          </div>
          <div className="icon-container" onClick={() => togglePanel("log")}>
            <HistoryIcon />
            <span>ログ</span>
          </div>
          <div
            className="icon-container"
            onClick={() => togglePanel("settings")}
          >
            <SettingsIcon />
            <span>設定</span>
          </div>
        </div>

        <div className="sidebar-bottom-controls">
          <div
            className={`icon-container ${isDPadVisible ? "active" : ""}`}
            onClick={() => setIsDPadVisible(!isDPadVisible)}
          >
            <SportsEsportsIcon />
            <span>操作</span>
          </div>
        </div>
      </div>

      {isDPadVisible && (
        <div className="d-pad-wrapper">
          <button
            className="d-pad-button up"
            onMouseDown={() => handleMoveStart("UP")}
            onMouseUp={() => handleMoveEnd("UP")}
            onMouseLeave={() => handleMoveEnd("UP")}
            onTouchStart={() => handleMoveStart("UP")}
            onTouchEnd={() => handleMoveEnd("UP")}
            aria-label="上に移動"
          >
            ▲
          </button>
          <button
            className="d-pad-button left"
            onMouseDown={() => handleMoveStart("LEFT")}
            onMouseUp={() => handleMoveEnd("LEFT")}
            onMouseLeave={() => handleMoveEnd("LEFT")}
            onTouchStart={() => handleMoveStart("LEFT")}
            onTouchEnd={() => handleMoveEnd("LEFT")}
            aria-label="左に移動"
          >
            ◀
          </button>
          <button
            className="d-pad-button right"
            onMouseDown={() => handleMoveStart("RIGHT")}
            onMouseUp={() => handleMoveEnd("RIGHT")}
            onMouseLeave={() => handleMoveEnd("RIGHT")}
            onTouchStart={() => handleMoveStart("RIGHT")}
            onTouchEnd={() => handleMoveEnd("RIGHT")}
            aria-label="右に移動"
          >
            ▶
          </button>
          <button
            className="d-pad-button down"
            onMouseDown={() => handleMoveStart("DOWN")}
            onMouseUp={() => handleMoveEnd("DOWN")}
            onMouseLeave={() => handleMoveEnd("DOWN")}
            onTouchStart={() => handleMoveStart("DOWN")}
            onTouchEnd={() => handleMoveEnd("DOWN")}
            aria-label="下に移動"
          >
            ▼
          </button>
        </div>
      )}

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
