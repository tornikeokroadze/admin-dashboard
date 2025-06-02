// src/redux/slices/messageSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  content: string | null;
  type: "success" | "error" | "info" | null;
  undoable?: boolean;
  timeoutId?: NodeJS.Timeout;
  itemId?: number;
}

const initialState: MessageState = {
  content: null,
  type: null,
  undoable: false,
  timeoutId: undefined,
  itemId: undefined,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage: (
      state,
      action: PayloadAction<{
        content: string;
        type: "success" | "error" | "info";
        undoable?: boolean;
        timeoutId?: NodeJS.Timeout;
        itemId?: number;
      }>
    ) => {
      return { ...state, ...action.payload };
    },
    clearMessage: () => initialState,
  },
});

export const { showMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
