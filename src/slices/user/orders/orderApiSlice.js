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
    getOrdersForUser: builder.query({
      query: ({ itemsPerPage, currentPage }) => ({
        url: `${orderUrl}/user-orders?page=${currentPage}&limit=${itemsPerPage}`,
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${orderUrl}/${id}`,
      }),
    }),
    cancelOrderItem:builder.mutation({
      query: ({orderId,itemId})=>({
        url:`${orderUrl}/${orderId}/items/${itemId}/cancel`,
        method:"PATCH",
      })
    })
  }),
});

export const {
  useCreateOrderMutation,
  useLazyGetOrdersForUserQuery,
  useLazyGetOrderByIdQuery,
  useCancelOrderItemMutation
} = userOrderApiSlice;
