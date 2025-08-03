import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import { Experience } from "./components/graphics/experience/Experience";
import ProfileEdit from "./components/profile_edit/ProfileEdit";
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
  updateDoc,
  arrayRemove,
  query,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { LogEntry, ParticipantData } from "./Types";
import ChatLog from "./components/chat_log/ChatLog";
import { TILE_SIZE } from "./components/graphics/constants/game-world";
import { getBotResponse } from "./components/graphics/Bot/botLogic";
import ProfileScreen from "./components/profile_screen/ProfileScreen";

type ProfileView = {
  isOpen: boolean;
  view: "main" | "following" | "followers" | "userProfile";
  data?: any;
};

function App() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [allPositions, setAllPositions] = useState<{
    [uid: string]: ParticipantData;
  }>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [profileView, setProfileView] = useState<ProfileView>({
    isOpen: false,
    view: "main",
    data: null,
  });

  const userId = user?.uid || "";
  const [loggedEncounters, setLoggedEncounters] = useState<Set<string>>(
    new Set()
  );

  const botPos = useMemo(() => ({ x: TILE_SIZE * 5, y: TILE_SIZE * 6 }), []);

  const me = useMemo(() => allPositions[userId], [allPositions, userId]);
  const myChatPartnerId = useMemo(() => me?.chattingWith || null, [me]);
  const chatPartner = useMemo(
    () => (myChatPartnerId ? allPositions[myChatPartnerId] : null),
    [allPositions, myChatPartnerId]
  );

  const isChatActive = useMemo(() => {
    if (!me || !myChatPartnerId) return false;
    if (myChatPartnerId === "Bot" || chatPartner?.chattingWith === userId) {
      return true;
    }
    return false;
  }, [me, myChatPartnerId, chatPartner, userId]);

  const adjacentUserIds = useMemo(() => {
    if (!userId) return [];
    const myPos = allPositions[userId]?.position;
    if (!myPos) return [];
    return Object.entries(allPositions)
      .filter(([uid, data]) => {
        if (uid === userId || uid === "Bot" || !data.position) return false;
        const distance = Math.sqrt(
          Math.pow(myPos.x - data.position.x, 2) +
            Math.pow(myPos.y - data.position.y, 2)
        );
        return distance <= TILE_SIZE * 1.5;
      })
      .map(([uid]) => uid);
  }, [allPositions, userId]);

  const isAdjacentToBot = useMemo(() => {
    if (!userId) return false;
    const myPos = allPositions[userId]?.position;
    if (!myPos) return false;
    return (
      Math.abs(myPos.x - botPos.x) + Math.abs(myPos.y - botPos.y) <=
      TILE_SIZE * 1.5
    );
  }, [allPositions, userId, botPos]);

  const potentialChatPartnerId = useMemo(() => {
    if (isAdjacentToBot) return "Bot";
    if (adjacentUserIds.length > 0) return adjacentUserIds[0];
    return null;
  }, [isAdjacentToBot, adjacentUserIds]);

  const potentialPartnerData = useMemo(
    () =>
      potentialChatPartnerId ? allPositions[potentialChatPartnerId] : null,
    [allPositions, potentialChatPartnerId]
  );
  const isPotentialPartnerBusy = useMemo(() => {
    if (!potentialPartnerData || !potentialPartnerData.chattingWith)
      return false;
    return potentialPartnerData.chattingWith !== userId;
  }, [potentialPartnerData, userId]);

  const showChatPrompt = useMemo(() => {
    return !isChatActive && !!potentialChatPartnerId && !isPotentialPartnerBusy;
  }, [isChatActive, potentialChatPartnerId, isPotentialPartnerBusy]);

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

  const handleStartChat = useCallback(async () => {
    if (!userId || !potentialChatPartnerId) return;

    const batch = writeBatch(db);
    const myRef = doc(db, "rooms", "default-lobby", "participants", userId);

    if (potentialChatPartnerId === "Bot") {
      const botRef = doc(db, "rooms", "default-lobby", "participants", "Bot");
      const initialBotMessage =
        "こんにちは！何かプログラミングで気になることはありますか？";

      const myPos = allPositions[userId]?.position;
      let botDirection: "UP" | "DOWN" | "LEFT" | "RIGHT" = "DOWN";
      if (myPos) {
        const dx = myPos.x - botPos.x;
        const dy = myPos.y - botPos.y;
        if (Math.abs(dx) > Math.abs(dy)) {
          botDirection = dx > 0 ? "LEFT" : "RIGHT";
        } else {
          botDirection = dy > 0 ? "UP" : "DOWN";
        }
      }

      batch.update(myRef, { chattingWith: "Bot", message: "" });
      batch.set(
        botRef,
        {
          chattingWith: userId,
          message: initialBotMessage,
          messageTimestamp: new Date(),
          direction: botDirection,
        },
        { merge: true }
      );

      await batch.commit();
    } else {
      const partnerRef = doc(
        db,
        "rooms",
        "default-lobby",
        "participants",
        potentialChatPartnerId
      );
      batch.update(myRef, {
        chattingWith: potentialChatPartnerId,
        message: "",
      });
      batch.update(partnerRef, { chattingWith: userId, message: "" });
      await batch.commit();
    }
  }, [userId, potentialChatPartnerId, allPositions, botPos]);

  const handleEndChat = useCallback(async () => {
    if (!userId || !myChatPartnerId) return;

    const batch = writeBatch(db);
    const myRef = doc(db, "rooms", "default-lobby", "participants", userId);

    if (myChatPartnerId === "Bot") {
      const botRef = doc(db, "rooms", "default-lobby", "participants", "Bot");
      batch.update(myRef, { chattingWith: null, message: "" });
      batch.set(
        botRef,
        { chattingWith: null, message: "", direction: "DOWN" },
        { merge: true }
      );
      await batch.commit();
    } else {
      const partnerRef = doc(
        db,
        "rooms",
        "default-lobby",
        "participants",
        myChatPartnerId
      );
      batch.update(myRef, { chattingWith: null, message: "" });
      batch.update(partnerRef, { chattingWith: null, message: "" });
      await batch.commit();
    }
  }, [userId, myChatPartnerId]);

  const addChatMessage = useCallback(
    async (messageText: string) => {
      if (!user || !user.uid || !messageText.trim() || !myChatPartnerId) return;

      const myRef = doc(db, "rooms", "default-lobby", "participants", user.uid);
      await updateDoc(myRef, {
        message: messageText,
        messageTimestamp: new Date(),
      });

      if (myChatPartnerId === "Bot") {
        setTimeout(async () => {
          const botResponseText = getBotResponse(messageText);
          const botRef = doc(
            db,
            "rooms",
            "default-lobby",
            "participants",
            "Bot"
          );
          await setDoc(
            botRef,
            {
              message: botResponseText,
              messageTimestamp: new Date(),
            },
            { merge: true }
          );
        }, 500);
      }
    },
    [user, myChatPartnerId]
  );

  const handleFollow = useCallback(
    async (targetUserId: string) => {
      if (
        !user ||
        !user.uid ||
        user.uid === targetUserId ||
        targetUserId === "Bot"
      )
        return;
      const currentUserId = user.uid;
      const currentUserRef = doc(db, "users", currentUserId);
      const targetUserRef = doc(db, "users", targetUserId);
      try {
        const batch = writeBatch(db);
        batch.update(currentUserRef, { following: arrayUnion(targetUserId) });
        batch.update(targetUserRef, { followers: arrayUnion(currentUserId) });
        await batch.commit();
      } catch (error) {
        console.error("フォロー処理中にエラーが発生しました:", error);
      }
    },
    [user]
  );

  const handleUnfollow = useCallback(
    async (targetUserId: string) => {
      if (!user || !user.uid || user.uid === targetUserId) return;
      const currentUserId = user.uid;
      const currentUserRef = doc(db, "users", currentUserId);
      const targetUserRef = doc(db, "users", targetUserId);
      try {
        const batch = writeBatch(db);
        batch.update(currentUserRef, { following: arrayRemove(targetUserId) });
        batch.update(targetUserRef, { followers: arrayRemove(currentUserId) });
        await batch.commit();
      } catch (error) {
        console.error("アンフォロー処理中にエラーが発生しました:", error);
      }
    },
    [user]
  );

  const prevIsChatActive = useRef(isChatActive);

  useEffect(() => {
    if (isChatActive && !prevIsChatActive.current) {
      setProfileView({ isOpen: false, view: "main", data: null });
    }
    prevIsChatActive.current = isChatActive;
  }, [isChatActive]);

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
        const participantsQuery = query(
          collection(db, "rooms", "default-lobby", "participants")
        );
        const unsubscribeParticipants = onSnapshot(
          participantsQuery,
          (snapshot: QuerySnapshot) => {
            const positions: { [key: string]: ParticipantData } = {};
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            snapshot.forEach((doc: QueryDocumentSnapshot) => {
              const data = doc.data() as Omit<ParticipantData, "uid">;
              if (
                doc.id === loginUser.uid ||
                (doc.id !== "Bot" &&
                  data.updatedAt &&
                  data.updatedAt.toMillis() > fiveMinutesAgo) ||
                doc.id === "Bot"
              ) {
                positions[doc.id] = {
                  ...data,
                  uid: doc.id,
                };
              }
            });

            const botDataFromDb = positions["Bot"] || {};
            positions["Bot"] = {
              ...botDataFromDb,
              uid: "Bot",
              userName: "Bot",
              position: botPos,
              direction: botDataFromDb.direction || "DOWN",
            };
            delete (positions["Bot"] as Partial<ParticipantData>).avatarId;

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
  }, [dispatch, botPos]);

  useEffect(() => {
    const isProximity = adjacentUserIds.length > 0;
    if (isProximity) {
      setLoggedEncounters((prevLogged) => {
        const newLogged = new Set(prevLogged);
        let hasNewEncounters = false;

        adjacentUserIds.forEach((uid) => {
          if (!newLogged.has(uid)) {
            const userName = allPositions[uid]?.userName;
            if (userName) {
              addLog({
                message: `${userName}さんとエンカウントしました`,
                userId: uid,
                userName: userName,
              });
              newLogged.add(uid);
              hasNewEncounters = true;
            }
          }
        });

        return hasNewEncounters ? newLogged : prevLogged;
      });
    } else {
      if (loggedEncounters.size > 0) {
        setLoggedEncounters(new Set());
      }
    }
  }, [adjacentUserIds, allPositions, addLog, loggedEncounters.size]);

  useEffect(() => {
    if (isChatActive && myChatPartnerId) {
      const partnerIsStillAdjacent =
        adjacentUserIds.includes(myChatPartnerId) ||
        (myChatPartnerId === "Bot" && isAdjacentToBot);
      if (!partnerIsStillAdjacent) {
        handleEndChat();
      }
    }
  }, [
    isChatActive,
    adjacentUserIds,
    isAdjacentToBot,
    myChatPartnerId,
    handleEndChat,
  ]);

  const positionsForExperience = useMemo(() => {
    const { Bot, ...rest } = allPositions;
    return rest;
  }, [allPositions]);

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
                      handleUnfollow={handleUnfollow}
                      followingList={user?.following || []}
                      onProfileClick={() =>
                        setProfileView({ isOpen: true, view: "main" })
                      }
                    />
                  </ErrorBoundary>
                  <Experience
                    allPositions={positionsForExperience}
                    userId={userId}
                    addLog={addLog}
                    addChatMessage={addChatMessage}
                    isChatActive={isChatActive}
                    showChatPrompt={showChatPrompt}
                    onStartChat={handleStartChat}
                    myChatPartnerId={myChatPartnerId}
                  />
                  {isChatActive && (
                    <ChatLog
                      userId={userId}
                      allPositions={allPositions}
                      onEndChat={handleEndChat}
                    />
                  )}
                  <ProfileScreen
                    profileView={profileView}
                    setProfileView={setProfileView}
                  />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile/edit"
            element={user ? <ProfileEdit /> : <Navigate to="/login" replace />}
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
