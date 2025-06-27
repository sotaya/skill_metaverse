import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarList } from "../graphics/avatar/AvatarList";
import { TILE_SIZE } from "../graphics/constants/game-world";
import { Sprite, Stage } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppSelector } from "../../app/hooks";
import "./Profile.scss";

const STAGE_WIDTH = 120;
const STAGE_HEIGHT = 120;

const Profile = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.displayName || "");
        setSkills(Array.isArray(data.skills) ? data.skills.join(", ") : "");
        setGoal(data.goal || data.status || "");
        setBio(data.bio || data.content || "");
        setSelectedIndex(typeof data.avatarId === "number" ? data.avatarId : 0);
      }
    };
    fetchUserData();
  }, [user]);
  const handleAvatarChange = useCallback((delta: number) => {
    setSelectedIndex(
      (prev) => (prev + delta + AvatarList.length) % AvatarList.length
    );
  }, []);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const updatedProfile = {
      displayName: username,
      skills: skillsArray,
      status: goal,
      avatarId: selectedIndex,
      content: bio,
    };
    await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
    navigate("/");
  };
  return (
    <div className="profile-bg">
      <div className="profile-card">
        <div className="profile-header">
          <h2>プロフィール編集</h2>
          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowBackIosNewIcon />
            ホームに戻る
          </button>
        </div>
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group avatar-group">
            <label>アバター</label>
            <div className="avatar-display-area">
              <button
                type="button"
                onClick={() => handleAvatarChange(-1)}
                className="arrow-button"
              >
                {"<"}
              </button>
              <Stage
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                options={{ backgroundAlpha: 0 }}
              >
                <Sprite
                  texture={
                    new Texture(
                      Texture.from(AvatarList[selectedIndex]).baseTexture,
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
              <button
                type="button"
                onClick={() => handleAvatarChange(1)}
                className="arrow-button"
              >
                {">"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">所持スキル</label>
            <input
              id="skills"
              type="text"
              placeholder="React, TypeScript, Python など"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="goal">スキルについての目標</label>
            <input
              id="goal"
              type="text"
              placeholder="目標を入力"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">自己紹介</label>
            <textarea
              id="bio"
              placeholder="自己紹介を入力"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="main-btn">
            保存する
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
