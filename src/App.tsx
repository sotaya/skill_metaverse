import React, { useEffect } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import { Experience } from "./components/graphics/experience/Experience";
import Profile from "./components/profile/Profile";
import Login from "./components/login/Login";
import { login, logout } from "./features/userSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { auth } from "./firebase";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallBack } from "./utils/ErrorFallBack";
import RegistrationFlow from "./components/login/RegistrationFlow/RegistrationFlow";

function App() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const allPositions = {};
  const userId = user?.uid || "";
  useEffect(() => {
    auth.onAuthStateChanged((loginUser) => {
      console.log("onAuthStateChangedが発火しました. loginUser:", loginUser);
      if (loginUser) {
        dispatch(
          login({
            uid: loginUser.uid,
            email: loginUser.email,
            userName: "取得中...",
            avatarId: 0,
            followers: [],
            following: [],
            skills: [],
            status: "",
            content: "",
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <div className="app-main">
                  <ErrorBoundary FallbackComponent={ErrorFallBack}>
                    <Sidebar />
                  </ErrorBoundary>
                  <Experience allPositions={allPositions} userId={userId} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/edit-profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <RegistrationFlow /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
