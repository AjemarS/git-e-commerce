import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../models/user";
import axios from "../../api/axios";

interface UserState {
  user: IUser;
  isAuthenticated: boolean;
  userId: number;
  userToken: {
    accessToken: string;
    refreshToken: string;
  };
}

const initialState: UserState = {
  user: {
    id: 0,
    password: "",
    email: "",
    cart: [],
  },
  userId: 0,
  isAuthenticated: false,
  userToken: {
    accessToken: "",
    refreshToken: "",
  },
};

export const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setUserToken: (state, action: PayloadAction<typeof state.userToken>) => {
      state.userToken = action.payload;
    },
    login: (state) => {
      state.isAuthenticated = true;
      const userId = localStorage.getItem("userId");
      state.userId = Number(userId);
      localStorage.setItem("isAuthenticated", "true");
      axios.defaults.headers.common["Authorization"] = localStorage.getItem("accessToken");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("userId");
      localStorage.setItem("isAuthenticated", "false");
      axios.defaults.headers.common["Authorization"] = null
    },
  },
});

export const { setUser, setUserToken, setUserId, login, logout } = UserSlice.actions;
export default UserSlice.reducer;
