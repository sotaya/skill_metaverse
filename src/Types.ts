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
  };
}

export interface InitialUsersState {
  userId: string | null;
}

export interface InitialRoomsState {
  roomId: string | null;
  roomName: String | null;
}
