import React from "react";
import { useAppSelector } from "../../app/hooks";
import { AvatarList } from "../graphics/avatar/AvatarList";
import { TILE_SIZE } from "../graphics/constants/game-world";
import { Stage, Sprite } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import "./ProfileScreen.scss";

type ProfileView = {
  isOpen: boolean;
  view: "main" | "following" | "followers" | "userProfile";
  data?: any;
};

interface ProfileScreenProps {
  profileView: ProfileView;
  setProfileView: (view: ProfileView) => void;
}

const STAGE_WIDTH = 120;
const STAGE_HEIGHT = 120;

const ProfileScreen = ({ profileView, setProfileView }: ProfileScreenProps) => {
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleClose = () => {
    setProfileView({ isOpen: false, view: "main", data: null });
  };

  const handleEditProfile = async () => {
    if (user) {
      try {
        const positionDocRef = doc(
          db,
          "rooms",
          "default-lobby",
          "participants",
          user.uid
        );
        await setDoc(
          positionDocRef,
          { position: { x: -1000, y: -1000 } },
          { merge: true }
        );
      } catch (error) {
        console.error("Failed to reset user position:", error);
      }
    }
    navigate("/profile/edit");
  };

  const renderContent = () => {
    switch (profileView.view) {
      case "following":
        return (
          <UserList
            userIds={user?.following || []}
            title="フォロー中"
            onUserClick={(userId) =>
              setProfileView({
                isOpen: true,
                view: "userProfile",
                data: { userId },
              })
            }
          />
        );
      case "followers":
        return (
          <UserList
            userIds={user?.followers || []}
            title="フォロワー"
            onUserClick={(userId) =>
              setProfileView({
                isOpen: true,
                view: "userProfile",
                data: { userId },
              })
            }
          />
        );
      case "userProfile":
        return (
          <UserProfile
            userId={profileView.data.userId}
            onBack={() => setProfileView({ isOpen: true, view: "main" })}
          />
        );
      case "main":
      default:
        if (!user) return null;
        return (
          <div className="profile-main-content">
            <div className="profile-header">
              <Stage
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                options={{ backgroundAlpha: 0 }}
              >
                <Sprite
                  texture={
                    new Texture(
                      Texture.from(AvatarList[user.avatarId || 0]).baseTexture,
                      new Rectangle(0, 64 * 2, 64, 64)
                    )
                  }
                  x={STAGE_WIDTH / 2}
                  y={STAGE_HEIGHT / 2}
                  width={TILE_SIZE * 2.5}
                  height={TILE_SIZE * 2.5}
                  anchor={0.5}
                />
              </Stage>
              <div className="profile-info">
                <h2>{user.userName}</h2>
                <p className="profile-status">{user.status}</p>
              </div>
              <div className="profile-follow-stats">
                <button
                  onClick={() =>
                    setProfileView({ isOpen: true, view: "following" })
                  }
                >
                  <strong>{user.following?.length || 0}</strong>
                  <span>フォロー中</span>
                </button>
                <button
                  onClick={() =>
                    setProfileView({ isOpen: true, view: "followers" })
                  }
                >
                  <strong>{user.followers?.length || 0}</strong>
                  <span>フォロワー</span>
                </button>
              </div>
              <button
                className="profile-edit-button"
                onClick={handleEditProfile}
              >
                プロフィールを編集
              </button>
            </div>

            <div className="profile-body">
              <div className="profile-section">
                <h3>自己紹介</h3>
                <p>{user.content || "自己紹介が設定されていません。"}</p>
              </div>
              <div className="profile-section">
                <h3>スキル</h3>
                <div className="profile-skills">
                  {user.skills?.length > 0 ? (
                    user.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>スキルが設定されていません。</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`profile-screen-overlay ${profileView.isOpen ? "open" : ""}`}
    >
      <div className="profile-screen-panel">
        <div className="profile-screen-header">
          {profileView.view !== "main" && (
            <button
              className="back-button"
              onClick={() => setProfileView({ isOpen: true, view: "main" })}
              aria-label="戻る"
            >
              <ArrowBackIcon />
            </button>
          )}
          <button
            className="close-button"
            onClick={handleClose}
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileScreen;
