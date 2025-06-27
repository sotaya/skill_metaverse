import { createSlice } from "@reduxjs/toolkit";
import { InitialUsersState } from "../Types";

const initialState: InitialUsersState = {
  userId: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersInfo: (state, action) => {
      state.userId = action.payload.userId;
    },
  },
});

export const { setUsersInfo } = usersSlice.actions;
export default usersSlice.reducer;
