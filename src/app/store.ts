import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import roomsReducer from "../features/roomsSlice";
import controlsReducer from "../features/controlsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomsReducer,
    controls: controlsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
