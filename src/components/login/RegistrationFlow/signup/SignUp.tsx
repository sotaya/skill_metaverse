import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../../../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./SignUp.scss";
import { doc, setDoc } from "firebase/firestore";

const SignUp = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          email: result.user.email,
          uid: result.user.uid,
          createdAt: new Date(),
        },
        { merge: true }
      );
      onComplete();
    } catch (err: any) {
      setError("Google新規登録に失敗しました: " + err.message);
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
          <button className="main-btn" type="submit">
            新規登録
          </button>
        </form>
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignUp}
        >
          <AccountCircleIcon className="google-icon" />
          Googleで新規登録
        </button>
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
