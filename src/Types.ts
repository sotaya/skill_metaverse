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
  userId?: string; // ログに関連するユーザーのID
  userName?: string; // ログに関連するユーザー名
}
