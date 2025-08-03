import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { doc, setDoc } from "firebase/firestore";
import "./SignUp.scss";

const SignUp = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password === passConfirm) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            createdAt: new Date(),
          },
          { merge: true }
        );
        onComplete();
      } catch (err: any) {
        setError("新規登録に失敗しました: " + err.message);
      }
    } else {
      setError("パスワードが異なります");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signup-bg">
      <div className="signup-card">
        <div className="signup-header">
          <NoteAddIcon className="signup-icon" />
          <h2>新規登録</h2>
        </div>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="パスワード（確認）"
            value={passConfirm}
            onChange={(e) => setPassConfirm(e.target.value)}
            required
          />
          <button className="main-btn" type="submit">
            新規登録
          </button>
        </form>
        <div className="to-login">
          すでにアカウントをお持ちの方は
          <button type="button" className="link-btn" onClick={handleLogin}>
            ログイン
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default SignUp;
