import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppSelector } from "../../app/hooks";
import "./Settings.scss";
import LicenseInfo from "./LicenseInfo"; // LicenseInfoコンポーネントをインポート

const Settings = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const roomId = "default-lobby";
  const [showLicense, setShowLicense] = useState(false); // ライセンス表示用のstateを追加

  const resetUserPosition = async () => {
    if (user && roomId) {
      try {
        const positionDocRef = doc(
          db,
          "rooms",
          roomId,
          "participants",
          user.uid
        );
        await setDoc(
          positionDocRef,
          { position: { x: -1000, y: -1000 } },
          { merge: true }
        );
      } catch (error) {
        console.error("ユーザーの位置情報のリセットに失敗しました:", error);
      }
    }
  };

  const handleEditProfile = async () => {
    await resetUserPosition();
    onClose();
    navigate("/profile/edit");
  };

  const handleLogout = async () => {
    await resetUserPosition();
    const auth = getAuth();
    await signOut(auth);
    onClose();
  };

  return (
    <div className="settings-panel-content">
      {showLicense ? (
        // showLicenseがtrueの場合、ライセンス情報を表示
        <LicenseInfo onBack={() => setShowLicense(false)} />
      ) : (
        // showLicenseがfalseの場合、通常の設定画面を表示
        <>
          <div className="settingsHeader">
            <span>設定</span>
            <button
              className="settingsClose"
              onClick={onClose}
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
          <div className="settingsContent">
            <button className="settingsBtn" onClick={handleEditProfile}>
              プロフィール編集
            </button>
            <button
              className="settingsBtn"
              onClick={() => setShowLicense(true)}
            >
              ライセンス情報
            </button>
            <button className="settingsBtn logout" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
