import { createSlice } from "@reduxjs/toolkit";
const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState, //initialState : initialState, : viết tắt khi tên field và tên biến trùng nhau
  reducers: {
    login: (state, action) => {
      state = action.payload;
      return state;
    },
    logout: () => initialState,
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
