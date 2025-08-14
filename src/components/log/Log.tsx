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
            <div className="log-entry-main">
              <p>
                <span className="log-timestamp">[{log.timestamp}]</span>{" "}
                {log.message}
              </p>
              {log.userId && log.userId !== "bot" && (
                <button
                  className="follow-button"
                  onClick={() => handleFollowToggle(log.userId!)}
                >
                  {followingList.includes(log.userId)
                    ? "フォロー中"
                    : "フォロー"}
                </button>
              )}
            </div>
            {log.sharedLinks && log.sharedLinks.length > 0 && (
              <div className="log-shared-links">
                <p className="shared-links-title">共有リンク:</p>
                <ul>
                  {log.sharedLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Log;
