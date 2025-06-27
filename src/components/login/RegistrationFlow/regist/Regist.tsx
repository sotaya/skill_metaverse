import React, { useState } from "react";
import PsychologyIcon from "@mui/icons-material/Psychology";
import "./Regist.scss";
import { auth, db } from "../../../../firebase";
import { doc, setDoc } from "firebase/firestore";

const Regist = ({ onComplete }: { onComplete: () => void }) => {
  const [userName, setUserName] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleNext = async () => {
    if (!userName.trim()) {
      alert("ユーザーネームを入力してください。");
      return;
    }
    if (skills.length === 0) {
      alert("スキルを1つ以上登録してください。");
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log("登録されたスキル:", skills);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("ユーザーが認証されていません");
      await setDoc(
        doc(db, "users", user.uid),
        { skills: skills, userName: userName },
        { merge: true }
      );
      onComplete();
    } catch (err: any) {
      setError(err.message || "通信中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="regist-bg">
      <div className="regist-card">
        <div className="regist-header">
          <PsychologyIcon className="header-icon" />
          <h2>ユーザー登録</h2>
        </div>
        <form onSubmit={handleAddSkill} className="regist-input-form">
          <input
            type="text"
            placeholder="ユーザーネーム"
            className="regist-username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLoading}
            required
          />
          <div className="regist-skill">
            <input
              type="text"
              placeholder="例: React, TypeScript, Python"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="add-btn" disabled={isLoading}>
              追加
            </button>
          </div>
        </form>
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div key={index} className="skill-tag">
              {skill}
              <button
                type="button"
                className="remove-skill-btn"
                onClick={() => handleRemoveSkill(skill)}
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button
          type="button"
          className="main-btn"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? "登録中..." : "次へ"}
        </button>
      </div>
    </div>
  );
};

export default Regist;
