import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, verifyLogin } from "../thunk.js/auth";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state, action) => {
      state.user = null;
      state.loader = false;
    },
    adminLogout: (state, action) => {
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isAdmin = true;
        toast.success(action.payload);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAdmin = true;
        } else {
          state.isAdmin = false;
        }
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.isAdmin = false;
      });
  },
});

export default authSlice;
export const { userExists, userNotExists, adminLogout } = authSlice.actions;
