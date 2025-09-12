import { Timestamp } from "firebase/firestore";

export interface InitialUserState {
  user: null | {
    avatarId: number;
    userName: string;
    email: string;
    followers: string[];
    following: string[];
    skills: string[];
    status: string;
    content: string;
    uid: string;
    message?: string;
  };
}

export interface InitialUsersState {
  userId: string | null;
}

export interface InitialRoomsState {
  roomId: string | null;
  roomName: String | null;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  userId?: string;
  userName?: string;
  sharedLinks?: string[]; 
}

export interface ChatMessage {
  id: string;
  uid: string;
  userName: string;
  message: string;
  timestamp: Date | Timestamp;
}

export interface ParticipantData {
  uid: string;
  position: { x: number; y: number };
  userName: string;
  avatarId: number;
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT" | null;
  message?: string;
  chattingWith?: string | null;
  isTyping?: boolean;
}
