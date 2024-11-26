import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your tag types here


const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_FRONTEND_ENV === "development"
      ? import.meta.env.VITE_DEVELOPMENT_BACKEND_URL
      : import.meta.env.VITE_PRODUCTION_BACKEND_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: 'authenticationApi', // Optional: Define a custom reducer path if needed
  baseQuery: baseQuery,

  endpoints: (builder) => ({}), // You will define endpoints in other slices
});
