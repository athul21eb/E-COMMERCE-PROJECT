import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your tag types here


const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:${import.meta.env.VITE_SERVER_PORT}/v1`,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: 'authenticationApi', // Optional: Define a custom reducer path if needed
  baseQuery: baseQuery,

  endpoints: (builder) => ({}), // You will define endpoints in other slices
});
