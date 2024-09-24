import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
import adminApi from "./api/adminApi";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },

  middleware: (defaultMiddlewares) => [
    ...defaultMiddlewares(),
    api.middleware,
    adminApi.middleware,
  ],
});

export default store;
