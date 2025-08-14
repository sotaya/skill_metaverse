import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import type { Direction } from "../components/graphics/types/common";

interface ControlsState {
  heldDirections: Direction[];
}

const initialState: ControlsState = {
  heldDirections: [],
};

export const controlsSlice = createSlice({
  name: "controls",
  initialState,
  reducers: {
    addDirection: (state, action: PayloadAction<Direction>) => {
      if (!state.heldDirections.includes(action.payload)) {
        state.heldDirections.unshift(action.payload);
      }
    },
    removeDirection: (state, action: PayloadAction<Direction>) => {
      state.heldDirections = state.heldDirections.filter(
        (dir) => dir !== action.payload
      );
    },
  },
});

export const { addDirection, removeDirection } = controlsSlice.actions;

export const selectHeldDirections = (state: RootState) =>
  state.controls.heldDirections;

export default controlsSlice.reducer;
