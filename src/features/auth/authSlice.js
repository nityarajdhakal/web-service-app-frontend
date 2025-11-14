
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("accessToken") || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
