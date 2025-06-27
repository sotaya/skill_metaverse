import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setError("このメールアドレスは登録されていません。");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("ログインに失敗しました: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    console.log("1. handleLogin 開始");
    try {
      console.log("2. メールアドレスの存在チェック開始");
      const result = await signInWithPopup(auth, provider);
      const googleEmail = result.user.email;
      if (!googleEmail) {
        setError("Googleアカウントのメールアドレスが取得できませんでした。");
        await auth.signOut();
        return;
      }
      const methods = await fetchSignInMethodsForEmail(auth, googleEmail);
      if (methods.length === 0) {
        setError("このGoogleアカウントのメールアドレスは登録されていません。");
        console.log("メールアドレス未登録のため処理中断");
        await auth.signOut();
        return;
      }
      console.log("4. ログイン成功！画面遷移を実行します。");
      navigate("/");
    } catch (err: any) {
      console.error("5. ログイン処理でエラー発生", err);
      setError("Googleログインに失敗しました: " + err.message);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <ChatBubbleOutlineIcon className="login-icon" />
          <h2>ログイン</h2>
        </div>
        <form onSubmit={handleLogin}>
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
            ログイン
          </button>
        </form>
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <AccountCircleIcon className="google-icon" />
          Googleでログイン
        </button>
        <div className="to-signup">
          アカウントをお持ちでない方は
          <button type="button" className="link-btn" onClick={handleSignUp}>
            新規登録
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
