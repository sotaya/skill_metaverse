import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./Settings.scss";

//設定画面
const Settings = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    onClose();
    navigate("/edit-profile");
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    onClose();
    navigate("/login");
  };
  return (
    <div className="settingsPopover">
      <div className="settingsHeader">
        <span>設定</span>
        <button className="settingsClose" onClick={onClose} aria-label="閉じる">
          ✕
        </button>
      </div>
      <div className="settingsContent">
        <button className="settingsBtn" onClick={handleEditProfile}>
          プロフィール編集
        </button>
        <button className="settingsBtn logout" onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Settings;
