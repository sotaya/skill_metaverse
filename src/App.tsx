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
  Timestamp,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { LogEntry, ParticipantData } from "./Types";
import ChatLog from "./components/chat_log/ChatLog";
import { TILE_SIZE } from "./components/graphics/constants/game-world";
import { getBotResponse } from "./components/graphics/bot/BotLogic";
import ProfileScreen from "./components/profile_screen/ProfileScreen";

type ProfileView = {
  isOpen: boolean;
  view: "main" | "following" | "followers" | "userProfile";
  data?: any;
};

type TimeRestriction = {
  time_start: Timestamp | null;
  time_end: Timestamp | null;
};

function App() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [allPositions, setAllPositions] = useState<{
    [uid: string]: ParticipantData;
  }>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sharedLinks, setSharedLinks] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [profileView, setProfileView] = useState<ProfileView>({
    isOpen: false,
    view: "main",
    data: null,
  });

  const [isAiEnabled, setIsAiEnabled] = useState(false);

  const [timeRestriction, setTimeRestriction] =
    useState<TimeRestriction | null>(null);
  const [isAppActive, setIsAppActive] = useState(true);
  const [restrictionMessage, setRestrictionMessage] = useState("");

  const userId = user?.uid || "";

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
        const distance =
          Math.abs(myPos.x - data.position.x) +
          Math.abs(myPos.y - data.position.y);
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

  const handleTypingStatusChange = useCallback(
    async (isTyping: boolean) => {
      if (!userId) return;
      const myRef = doc(db, "rooms", "default-lobby", "participants", userId);
      try {
        await setDoc(myRef, { isTyping }, { merge: true });
      } catch (error) {
        console.error("Typing status update failed:", error);
      }
    },
    [userId]
  );

  const handleStartChat = useCallback(async () => {
    if (!userId || !potentialChatPartnerId) return;

    const myRef = doc(db, "rooms", "default-lobby", "participants", userId);

    if (potentialChatPartnerId === "Bot") {
      const batch = writeBatch(db);
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

      const startChatBatch = writeBatch(db);
      startChatBatch.update(myRef, {
        chattingWith: potentialChatPartnerId,
        message: "",
      });
      startChatBatch.update(partnerRef, {
        chattingWith: userId,
        message: "",
      });
      await startChatBatch.commit();

      setTimeout(() => {
        const greetingBatch = writeBatch(db);
        const now = new Date();
        greetingBatch.update(myRef, {
          message: "こんにちは",
          messageTimestamp: now,
        });
        greetingBatch.update(partnerRef, {
          message: "こんにちは",
          messageTimestamp: now,
        });
        greetingBatch.commit();
      }, 500);
    }
  }, [userId, potentialChatPartnerId, allPositions, botPos]);

  const handleEndChat = useCallback(async () => {
    if (!userId || !myChatPartnerId) return;

    const batch = writeBatch(db);
    const myRef = doc(db, "rooms", "default-lobby", "participants", userId);

    batch.update(myRef, { chattingWith: null, message: "", isTyping: false });

    if (myChatPartnerId === "Bot") {
      const botRef = doc(db, "rooms", "default-lobby", "participants", "Bot");
      batch.set(
        botRef,
        { chattingWith: null, message: "", direction: "DOWN" },
        { merge: true }
      );
    } else {
      const partnerRef = doc(
        db,
        "rooms",
        "default-lobby",
        "participants",
        myChatPartnerId
      );
      batch.update(partnerRef, { chattingWith: null, message: "" });
    }

    await batch.commit();
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
        const botRef = doc(db, "rooms", "default-lobby", "participants", "Bot");
        await setDoc(
          botRef,
          {
            isTyping: true,
            message: "考え中...",
            messageTimestamp: new Date(),
          },
          { merge: true }
        );

        const botResponseText = await getBotResponse(
          messageText,
          user.uid,
          isAiEnabled
        );

        await setDoc(
          botRef,
          {
            message: botResponseText,
            messageTimestamp: new Date(),
            isTyping: false,
          },
          { merge: true }
        );
      }
    },
    [user, myChatPartnerId, isAiEnabled]
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

  const handleLogout = async () => {
    if (user) {
      const positionDocRef = doc(
        db,
        "rooms",
        "default-lobby",
        "participants",
        user.uid
      );
      await setDoc(
        positionDocRef,
        { position: { x: -1000, y: -1000 } },
        { merge: true }
      );
    }
    const authInstance = getAuth();
    await signOut(authInstance);
  };

  const prevIsChatActive = useRef(isChatActive);
  const prevChatPartnerId = useRef(myChatPartnerId);
  const prevAllPositions = useRef(allPositions);

  useEffect(() => {
    if (!myChatPartnerId || !allPositions[myChatPartnerId]) return;

    const partnerData = allPositions[myChatPartnerId];
    const prevPartnerData = prevAllPositions.current[myChatPartnerId];

    if (
      partnerData.message &&
      partnerData.message !== prevPartnerData?.message
    ) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const foundUrls = partnerData.message.match(urlRegex);

      if (foundUrls) {
        setSharedLinks((prev) => {
          const existingLinks = prev[myChatPartnerId] || [];
          const combinedLinks = [...existingLinks, ...foundUrls];
          const newUniqueLinks = combinedLinks.filter(
            (link, index) => combinedLinks.indexOf(link) === index
          );
          return {
            ...prev,
            [myChatPartnerId]: newUniqueLinks,
          };
        });
      }
    }
    prevAllPositions.current = allPositions;
  }, [allPositions, myChatPartnerId]);

  useEffect(() => {
    if (prevIsChatActive.current && !isChatActive) {
      const partnerId = prevChatPartnerId.current;
      if (partnerId && partnerId !== "Bot") {
        const partnerInfo = prevAllPositions.current[partnerId];
        if (partnerInfo) {
          const linksForPartner = sharedLinks[partnerId] || [];
          addLog({
            message: `${partnerInfo.userName}さんとエンカウントしました`,
            userId: partnerInfo.uid,
            userName: partnerInfo.userName,
            sharedLinks: linksForPartner,
          });
          setSharedLinks((prev) => {
            const newSharedLinks = { ...prev };
            delete newSharedLinks[partnerId];
            return newSharedLinks;
          });
        }
      }
    }

    if (!prevIsChatActive.current && isChatActive) {
      setProfileView({ isOpen: false, view: "main", data: null });
    }

    prevIsChatActive.current = isChatActive;
    prevChatPartnerId.current = myChatPartnerId;
  }, [isChatActive, myChatPartnerId, addLog, sharedLinks]);

  useEffect(() => {
    const aiConfigDocRef = doc(db, "bot_ai", "Bot_AI");
    const unsubscribe = onSnapshot(aiConfigDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsAiEnabled(docSnap.data().isAiEnabled === true);
      } else {
        setIsAiEnabled(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timeDocRef = doc(db, "times", "time_usage");
    const unsubscribe = onSnapshot(timeDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setTimeRestriction(docSnap.data() as TimeRestriction);
      } else {
        setTimeRestriction({ time_start: null, time_end: null });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkTime = () => {
      if (!timeRestriction) {
        setIsAppActive(true);
        return;
      }

      const { time_start, time_end } = timeRestriction;

      if (time_start && time_end) {
        const now = new Date();
        const startTime = time_start.toDate();
        const endTime = time_end.toDate();

        if (now >= startTime && now <= endTime) {
          setIsAppActive(true);
          setRestrictionMessage("");
        } else {
          setIsAppActive(false);
          const formatTime = (date: Date) => {
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          };
          setRestrictionMessage(
            `このコンテンツは現在利用できません。\n利用可能時間: ${formatTime(
              startTime
            )} - ${formatTime(endTime)}`
          );
        }
      } else {
        setIsAppActive(true);
        setRestrictionMessage("");
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [timeRestriction]);

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
            snapshot.forEach((doc: QueryDocumentSnapshot) => {
              const data = doc.data() as Omit<ParticipantData, "uid">;
              positions[doc.id] = {
                ...data,
                uid: doc.id,
              };
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
                    allPositions={allPositions}
                    userId={userId}
                    addLog={addLog}
                    addChatMessage={addChatMessage}
                    isChatActive={isChatActive}
                    showChatPrompt={showChatPrompt}
                    onStartChat={handleStartChat}
                    onEndChat={handleEndChat}
                    onTypingStatusChange={handleTypingStatusChange}
                    myChatPartnerId={myChatPartnerId}
                    isAppActive={isAppActive}
                    restrictionMessage={restrictionMessage}
                    onLogout={handleLogout}
                  />
                  {isChatActive && (
                    <ChatLog
                      userId={userId}
                      allPositions={allPositions}
                      onEndChat={handleEndChat}
                      addChatMessage={addChatMessage}
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
