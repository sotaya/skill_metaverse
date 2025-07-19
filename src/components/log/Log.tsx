import React from "react";
import "./Log.scss";
import { LogEntry } from "../../Types";

interface LogProps {
  logs: LogEntry[];
  handleFollow: (targetUserId: string) => void;
  followingList: string[];
}

const Log = ({ logs, handleFollow, followingList }: LogProps) => {
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
            {/* ログにユーザーIDが含まれる場合のみフォローボタンを表示 */}
            {log.userId && (
              <button
                className="follow-button"
                onClick={() => handleFollow(log.userId!)}
                // 既にフォロー済みの場合はボタンを無効化
                disabled={followingList.includes(log.userId)}
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
