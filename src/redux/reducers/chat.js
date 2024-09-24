import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../utils/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationCount: 0,
  newMessageAlerts: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    resestNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      const index = state.newMessageAlerts.findIndex(
        (item) => item.chatId === action.payload.chatId
      );

      if (index !== -1) {
        state.newMessageAlerts[index].count += 1;
      } else {
        state.newMessageAlerts.push({
          chatId: action.payload.chatId,
          count: 1,
        });
      }
    },

    removeNewMessagesAlert: (state, action) => {
      state.newMessageAlerts = state.newMessageAlerts.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;

export const {
  incrementNotificationCount,
  resestNotificationCount,
  setNewMessagesAlert,
  removeNewMessagesAlert,
  setMessagesAlertsFromLocalStorage,
} = chatSlice.actions;
