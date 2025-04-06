import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (_state, action) => {
      return action.payload;
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return initialState;
    },
  },
});

export const { login: loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
