import { createSlice } from "@reduxjs/toolkit";
import { InitialRoomsState } from "../Types";

const initialState: InitialRoomsState = {
  roomId: null,
  roomName: null,
};

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRoomsInfo: (state, action) => {
      state.roomId = action.payload.roomId;
    },
  },
});

export const { setRoomsInfo } = roomsSlice.actions;
export default roomsSlice.reducer;
