import React from "react";
import "./TimeRestrictionOverlay.scss";

interface TimeRestrictionOverlayProps {
  message: string;
  onLogout: () => void;
}

const TimeRestrictionOverlay: React.FC<TimeRestrictionOverlayProps> = ({
  message,
  onLogout,
}) => {
  return (
    <div className="time-restriction-overlay">
      <div className="message-box">
        <p>{message}</p>
        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default TimeRestrictionOverlay;
