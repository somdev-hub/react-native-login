import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLogin: false,
    user: {}
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = {};
    }
  }
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
