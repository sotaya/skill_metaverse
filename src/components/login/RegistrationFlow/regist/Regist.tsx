import React, { useState } from 'react';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { auth, db } from '../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './Regist.scss';

const Regist = ({ onComplete }: { onComplete: () => void }) => {
  const [userName, setUserName] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleNext = async () => {
    if (!userName.trim()) {
      alert('ユーザーネームを入力してください。');
      return;
    }
    if (skills.length === 0) {
      alert('スキルを1つ以上登録してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log('登録されたスキル:', skills);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('ユーザーが認証されていません');
      await setDoc(
        doc(db, 'users', user.uid),
        { skills: skills, userName: userName },
        { merge: true }
      );
      onComplete();
    } catch (err: any) {
      setError(err.message || '通信中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="split-container">
      <div className="blue-panel">
        <div className="App-Name">
          <h1>Crosk</h1>
        </div>
        <div className="regist-Title">
          <h1 className="Title1">新規登録</h1>
          <h1 className="Title2">プロフィール登録</h1>
        </div>
      </div>
      <div className="regist-bg">
        <div className="regist-card">
          <ol className="regist-stepper">
            <li className="step-item">
              <div className="step-number">1</div>
              <div className="step-label">メール登録</div>
            </li>
            <li className="step-item is-active">
              <div className="step-number">2</div>
              <div className="step-label">プロフィール登録</div>
            </li>
            <li className="step-item">
              <div className="step-number">3</div>
              <div className="step-label">アバター選択</div>
            </li>
          </ol>
          <div className="regist-header">
            <PsychologyIcon className="header-icon" />
            <h2>プロフィール登録</h2>
          </div>

          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              placeholder="表示される名前を入力"
              className="regist-username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skill-input">プログラミングスキル</label>
            <p className="form-instruction">
              持っているスキルを1つずつ入力して「追加」ボタンを押してください。
            </p>
            <form onSubmit={handleAddSkill} className="regist-skill-form">
              <input
                id="skill-input"
                type="text"
                placeholder="例: React, TypeScript, Python"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" className="add-btn" disabled={isLoading}>
                追加
              </button>
            </form>
          </div>

          <div className="skills-list-container">
            <p className="skills-list-title">登録済みスキル</p>
            <div className="skills-list">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      className="remove-skill-btn"
                      onClick={() => handleRemoveSkill(skill)}
                      disabled={isLoading}
                      aria-label={`${skill}を削除`}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-skills-text">
                  まだスキルが登録されていません。
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="button"
            className="main-btn"
            onClick={handleNext}
            disabled={isLoading}
          >
            {isLoading ? '登録中...' : '次へ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Regist;
