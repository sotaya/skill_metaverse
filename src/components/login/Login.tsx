import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      try {
        console.log("メールアドレスでログイン開始:", email);
        await signInWithEmailAndPassword(auth, email, password);
        console.log("メールアドレスログイン成功:", email);
        navigate("/");
      } catch (err: any) {
        console.error("メールアドレスログイン失敗:", err);
        setError("ログインに失敗しました: " + err.message);
      }
    },
    [email, password, navigate]
  );

  const handleSignUp = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

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
