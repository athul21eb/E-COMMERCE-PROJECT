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
     
    },
    

    SetAccessToken: (state, action) => {
      const accessToken = action.payload;

      if (state.authInfo?.user) {
        state.authInfo.user.accessToken = accessToken;
       
      }
    },

    ClearCredentials: (state) => {
      state.authInfo.user = null;
     
    },

    //// Admin auth

    SetAdminCredentials: (state, action) => {
      state.authInfo.admin = action.payload;
     
    },

    SetAdminAccessToken: (state, action) => {
      const accessToken = action.payload;

      if (state.authInfo?.admin) {
        state.authInfo.admin.accessToken = accessToken;
     
      }
    },

    ClearAdminCredentials: (state) => {
      state.authInfo.admin = null;
   
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
