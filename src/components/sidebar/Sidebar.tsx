import React, { useState, useCallback } from "react";
import "./Sidebar.scss";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History"; // ログ用のアイコン
import Log from "../log/Log";
import Settings from "../settings/Settings";
import { LogEntry } from "../../Types";

interface SidebarProps {
  logs: LogEntry[];
  handleFollow: (targetUserId: string) => void;
  followingList: string[];
}

const Sidebar = ({ logs, handleFollow, followingList }: SidebarProps) => {
  const [activePanel, setActivePanel] = useState<"log" | "settings" | null>(
    null
  );

  // パネルの表示・非表示を切り替える関数
  const togglePanel = useCallback((panel: "log" | "settings") => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  }, []);

  return (
    <>
      {/* 縦型のアイコンバー */}
      <div className="sidebar-icon-bar">
        <div className="icon-container" onClick={() => togglePanel("log")}>
          <HistoryIcon />
          <span>ログ</span>
        </div>
        <div className="icon-container" onClick={() => togglePanel("settings")}>
          <SettingsIcon />
          <span>設定</span>
        </div>
      </div>

      {/* アクティブなパネルをサイドバーの横に表示 */}
      <div className={`sidebar-panel ${activePanel ? "is-open" : ""}`}>
        {activePanel === "log" && (
          <Log
            logs={logs}
            handleFollow={handleFollow}
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
