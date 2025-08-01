import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import { AvatarList } from "../graphics/avatar/AvatarList";
import { Sprite, Stage } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import { TILE_SIZE } from "../graphics/constants/game-world";
import "./ProfileEdit.scss";

const ProfileEdit = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState(user?.userName || "");
  const [avatarId, setAvatarId] = useState(user?.avatarId || 0);
  const [content, setContent] = useState(user?.content || "");
  const [status, setStatus] = useState(user?.status || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setAvatarId(user.avatarId);
      setContent(user.content);
      setStatus(user.status);
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleAddSkill = () => {
    if (currentSkill && !skills.includes(currentSkill) && skills.length < 10) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const updatedData = {
          userName,
          avatarId,
          content,
          status,
          skills,
        };
        await updateDoc(userDocRef, updatedData);

        const participantDocRef = doc(
          db,
          "rooms",
          "default-lobby",
          "participants",
          user.uid
        );
        await setDoc(
          participantDocRef,
          { userName, avatarId },
          { merge: true }
        );

        const updatedUserDoc = await getDoc(userDocRef);
        if (updatedUserDoc.exists()) {
          dispatch(login(updatedUserDoc.data()));
        }
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="profile-edit-page-wrapper">
      <div className="profile-edit-container">
        <div className="profile-edit-header">
          <button onClick={handleBack} className="back-button-edit">
            ← 戻る
          </button>
          <h1>プロフィール編集</h1>
        </div>

        <form className="profile-edit-form" onSubmit={handleUpdate}>
          <div className="form-section avatar-selection">
            <h3>アバター</h3>
            <div className="avatar-grid">
              {AvatarList.map((avatarSrc, index) => (
                <div
                  key={index}
                  className={`avatar-item ${
                    avatarId === index ? "selected" : ""
                  }`}
                  onClick={() => setAvatarId(index)}
                >
                  <Stage
                    width={80}
                    height={80}
                    options={{ backgroundAlpha: 0 }}
                  >
                    <Sprite
                      texture={
                        new Texture(
                          Texture.from(avatarSrc).baseTexture,
                          new Rectangle(0, 64 * 2, 64, 64)
                        )
                      }
                      width={TILE_SIZE * 2}
                      height={TILE_SIZE * 2}
                      anchor={0.5}
                      x={40}
                      y={40}
                    />
                  </Stage>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="userName">ユーザー名</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">目標</label>
              <input
                type="text"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="例：Reactエンジニアです"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">自己紹介</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>スキル</h3>
            <div className="skill-input-group">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="スキルを入力 (最大10個)"
              />
              <button type="button" onClick={handleAddSkill}>
                追加
              </button>
            </div>
            <div className="skills-display">
              {skills.map((skill, index) => (
                <div key={index} className="skill-tag-edit">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="save-button">
            保存する
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
