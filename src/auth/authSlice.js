import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USER, IS_DEMO } from 'config.js';

const initialState = {
  isLogin: false,
  currentUser: {},
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
      state.token = action?.payload?.loginToken
    },
    // setSignIn: (state, action="") => {
    //   state.isLoggedIn = true;
    //   state.token = action.payload.loginToken;
    // },
    setSignOut: (state) => {
      state.isLoggedIn = false;
      state.token = null;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    }
  },
});

export const { setCurrentUser, setSignOut, setStatus } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthStatus = (state) => state.auth.status;
export const selectCurrentUser = (state) => state.auth.currentUser;

const authReducer = authSlice.reducer;

export default authReducer;
