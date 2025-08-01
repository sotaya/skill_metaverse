import React from "react";
import { LogEntry } from "../../Types";
import "./Log.scss";

interface LogProps {
  logs: LogEntry[];
  handleFollow: (targetUserId: string) => void;
  handleUnfollow: (targetUserId: string) => void;
  followingList: string[];
}

const Log = ({
  logs,
  handleFollow,
  handleUnfollow,
  followingList,
}: LogProps) => {
  const handleFollowToggle = (targetUserId: string) => {
    if (followingList.includes(targetUserId)) {
      handleUnfollow(targetUserId);
    } else {
      handleFollow(targetUserId);
    }
  };

  return (
    <div className="log-container">
      <h3>エンカウントログ</h3>
      <div className="log-messages">
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <p>
              <span className="log-timestamp">[{log.timestamp}]</span>{" "}
              {log.message}
            </p>
            {log.userId && log.userId !== "bot" && (
              <button
                className="follow-button"
                onClick={() => handleFollowToggle(log.userId!)}
              >
                {followingList.includes(log.userId) ? "フォロー中" : "フォロー"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Log;
