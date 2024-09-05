import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authInfo: {
    user: null,
    admin: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetCredentials: (state, action) => {
      state.authInfo.user = {
        ...state.authInfo.user, // Keep existing user details
        ...action.payload,      // Overwrite with new data from the action payload
      };
      console.log("Settled user in state", state.authInfo.user);
    },
    

    SetAccessToken: (state, action) => {
      const accessToken = action.payload;

      if (state.authInfo?.user) {
        state.authInfo.user.accessToken = accessToken;
        console.log("Updated user access token in state");
      }
    },

    ClearCredentials: (state) => {
      state.authInfo.user = null;
      console.log("Cleared user credentials");
    },

    //// Admin auth

    SetAdminCredentials: (state, action) => {
      state.authInfo.admin = action.payload;
      console.log("Settled admin in state");
    },

    SetAdminAccessToken: (state, action) => {
      const accessToken = action.payload;

      if (state.authInfo?.admin) {
        state.authInfo.admin.accessToken = accessToken;
        console.log("Updated admin access token in state");
      }
    },

    ClearAdminCredentials: (state) => {
      state.authInfo.admin = null;
      console.log("Cleared admin credentials");
    },
  },
});

export const {
  SetCredentials,
  ClearCredentials,
  SetAccessToken,
  SetAdminAccessToken,
  SetAdminCredentials,
  ClearAdminCredentials,
} = authSlice.actions;

export default authSlice.reducer;
