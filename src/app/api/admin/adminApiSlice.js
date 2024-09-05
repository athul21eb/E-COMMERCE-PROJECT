import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { ClearAdminCredentials, SetAdminAccessToken } from "../../../slices/auth/authSlice.js";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.authInfo?.admin?.accessToken;
   
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  // console.log(args) //request url,method,body
  //console.log(api)  //signal,dispatch,getState()
  //console.log(extraOptions) //custom like {shout:true}



  let result = await baseQuery(args, api, extraOptions);

  

  // if you want , handle other status codes too
  if (result?.error?.status === 403) {


    console.log("sending refresh token ");


    const refreshResult = await baseQuery(
      "/auth/admin/resend-token",
      api,
      extraOptions
    );
   
    if (refreshResult?.data) {
      
      const { accessToken } = refreshResult?.data;

      api.dispatch(SetAdminAccessToken( accessToken ));

      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 401) {

        api.dispatch(ClearAdminCredentials());
        toast.error(`Your Login has expired `);


      }

      return refreshResult;
    }
  }

  // send refresh token to get new acess token
  return result;
};

export const adminApiSlice = createApi({
  reducerPath:"AdminApi",
  baseQuery: baseQueryWithReAuth,

  endpoints: (builder) => ({}),
});
