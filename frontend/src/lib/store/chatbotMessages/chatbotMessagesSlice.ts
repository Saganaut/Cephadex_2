import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "@store/store";

import { logoutUser } from "../user/actions";

interface source {
  source: string;
  context: string;
  pages: number[];
}
export interface Message {
  message: string;
  source?: source;
  type: "bot" | "user";
  timeStamp: Date;
  seen: boolean;
}

const initialState = {
  messages: [
    {
      message: "Hello, I'm Ceph. how can I help?",
      type: "bot",
      timeStamp: new Date(),
    },
  ] as Message[],
  status: "idle",
};

export const chatbotMessagesSlice = createSlice({
  name: "chatbotMessages",
  initialState,

  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const newMessage = action.payload;
      state.messages.push(newMessage);
    },
    markAsSeen: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.messages[index].seen = true;
    },
    clearMessages: (state) => {
      // remove all messages except the initial message
      state.messages = state.messages.slice(0, 1);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.messages = [];
      state.status = "idle";
    });
  },
});

export const { addMessage, clearMessages, markAsSeen } =
  chatbotMessagesSlice.actions;
export const selectChatbotMessages = (state: RootState): Message[] => {
  return state.chatbotMessages.messages;
};
export default chatbotMessagesSlice.reducer;
