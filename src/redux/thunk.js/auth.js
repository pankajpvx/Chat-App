import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config";

const adminLogin = createAsyncThunk("admin/login", async ({ value }) => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${server}/api/v1/admin/verify`,
      { secretKey: value },
      config
    );
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

const verifyLogin = createAsyncThunk("admin/verify", async () => {
  try {
    const { data } = await axios.get(`${server}/api/v1/admin`, {
      withCredentials: true,
    });
    return data.admin;
  } catch (error) {
    throw error.response.data.message;
  }
});

export { adminLogin, verifyLogin };
