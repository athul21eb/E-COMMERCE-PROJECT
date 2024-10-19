import { apiSlice } from "../../app/api/auth/authenticationApiSlice.js";
import { setCart } from "../user/cart/cartSlice.js";
import { setWishList } from "../user/wishList/wishListSlice.js";
import { ClearAdminCredentials, ClearCredentials, SetAdminCredentials, SetCredentials } from "./authSlice.js";

const USER_URL = "/auth/user";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    googleSignIn: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/google-signIn`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from login:", res.data);
          const { user } = res.data;
          dispatch(SetCredentials({ ...user }));
        } catch (error) {
          console.error("Error in login:", error);
        }
      },
     
    }),

    
    signUp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/sign-up`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from sign-up:", res.data);
          const { email } = res.data;
          dispatch(SetCredentials({ email }));
        } catch (error) {
          console.error("Error in sign-up:", error);
        }
      },
      // Tags for invalidation
     
    }),


    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from login:", res.data);
          const { user } = res.data;
          dispatch(SetCredentials({ ...user }));
        } catch (error) {
          console.error("Error in login:", error);
        }
      },
     
    }),


    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/reset-password`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
         console.log(res.data,"reset");
         
          dispatch(SetCredentials({user:null}));
        } catch (error) {
          console.error("Error in login:", error);
        }
      },
      // Tags for invalidation
      
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/resend-otp`,
        method: "POST",
        body: data,
      }),
      // Tags for invalidation
      
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from verify OTP:", res.data);
          const { user } = res.data;
          dispatch(SetCredentials({ ...user }));
        } catch (error) {
          console.error("Error in verify OTP:", error);
        }
      },
     
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(ClearCredentials());
          dispatch(setCart(null));
          dispatch(setWishList(null));
        } catch (error) {
          console.error("Error in logout:", error);
        }
      },
      
    }),
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `/auth/admin/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from admin login:", res.data);
          const { admin } = res.data;
          dispatch(SetAdminCredentials({ ...admin }));
        } catch (error) {
          console.error("Error in admin login:", error);
        }
      },
      providesTags: ['Admin'],
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `/auth/admin/logout`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(ClearAdminCredentials());
        } catch (error) {
          console.error("Error in admin logout:", error);
        }
      },
  
    }),
  }),
});

export const {
  useGoogleSignInMutation,
  useSignUpMutation,
  useLoginMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
  useLogoutMutation,
  useAdminLoginMutation,
  useAdminLogoutMutation,
} = authApiSlice;
