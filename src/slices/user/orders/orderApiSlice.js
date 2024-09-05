import userApiSlice from "../../../app/api/user/userApiSlice.js";

const orderUrl = "/user/orders";

const userOrderApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${orderUrl}/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {useCreateOrderMutation} = userOrderApiSlice;
