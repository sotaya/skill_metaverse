import React, { useEffect, useState, useCallback } from "react";
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
import { auth, db } from "./firebase";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallBack } from "./utils/ErrorFallBack";
import RegistrationFlow from "./components/login/RegistrationFlow/RegistrationFlow";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  arrayUnion,
  query,
} from "firebase/firestore";
import { LogEntry } from "./Types";

function App() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [allPositions, setAllPositions] = useState({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const userId = user?.uid || "";

  const addLog = useCallback((logData: Omit<LogEntry, "id" | "timestamp">) => {
    const now = new Date();
    const newLog: LogEntry = {
      id: `${now.getTime()}-${Math.random()}`,
      timestamp: `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      ...logData,
    };
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  }, []);

  const handleFollow = useCallback(
    async (targetUserId: string) => {
      if (!user || !user.uid || user.uid === targetUserId) return;

      const currentUserId = user.uid;
      const currentUserRef = doc(db, "users", currentUserId);
      const targetUserRef = doc(db, "users", targetUserId);

      try {
        const batch = writeBatch(db);
        batch.update(currentUserRef, {
          following: arrayUnion(targetUserId),
        });
        batch.update(targetUserRef, {
          followers: arrayUnion(currentUserId),
        });
        await batch.commit();
      } catch (error) {
        console.error("フォロー処理中にエラーが発生しました:", error);
      }
    },
    [user]
  );

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((loginUser) => {
      if (loginUser) {
        const userDocRef = doc(db, "users", loginUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, async (userDocSnap) => {
          let userData = userDocSnap.data();
          if (!userDocSnap.exists()) {
            const initialData = {
              uid: loginUser.uid,
              email: loginUser.email,
              userName: loginUser.displayName || "New User",
              avatarId: 0,
              followers: [],
              following: [],
              skills: [],
              status: "",
              content: "",
            };
            await setDoc(userDocRef, initialData);
            userData = initialData;
          }
          dispatch(
            login({
              uid: loginUser.uid,
              photo: userData?.photoURL || "",
              email: loginUser.email || "",
              displayName: loginUser.displayName || "",
              userName: userData?.userName || "",
              avatarId: userData?.avatarId ?? 0,
              followers: userData?.followers || [],
              following: userData?.following || [],
              skills: userData?.skills || [],
              status: userData?.status || "",
              content: userData?.content || "",
            })
          );
        });

        // ### 根本的な原因の解決策 ###
        // 以前の実装では、時間によるフィルタリングが自分自身のデータまで除外してしまい、
        // 位置情報が取得できなくなる問題がありました。
        //
        // この新しい実装では、participantsコレクション全体をリッスンし、
        // 5分以上更新がない他のユーザーのデータのみをクライアント側で除外します。
        // これにより、自分自身のデータは常に保持され、近接判定が正しく機能します。
        const participantsQuery = query(
          collection(db, "rooms", "default-lobby", "participants")
        );

        const unsubscribeParticipants = onSnapshot(
          participantsQuery,
          (snapshot) => {
            const positions: { [key: string]: any } = {};
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

            snapshot.forEach((doc) => {
              const data = doc.data();
              // 自分自身、または5分以内に更新されたアクティブなユーザーのみを対象とする
              if (
                doc.id === loginUser.uid ||
                (doc.id !== "bot" &&
                  data.updatedAt &&
                  data.updatedAt.toMillis() > fiveMinutesAgo)
              ) {
                positions[doc.id] = data;
              }
            });
            setAllPositions(positions);
          }
        );

        return () => {
          unsubscribeUser();
          unsubscribeParticipants();
        };
      } else {
        dispatch(logout());
        setAllPositions({});
      }
    });

    return () => {
      unsubscribeAuth();
    };
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
                    <Sidebar
                      logs={logs}
                      handleFollow={handleFollow}
                      followingList={user?.following || []}
                    />
                  </ErrorBoundary>
                  <Experience
                    allPositions={allPositions}
                    userId={userId}
                    addLog={addLog}
                  />
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
          <Route path="/signup" element={<RegistrationFlow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
