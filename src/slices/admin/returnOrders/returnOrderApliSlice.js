
import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";

const returnUrl = "admin/return-orders";
const returnOrdersApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReturnOrders: builder.query({
      query: ({ page, limit }) => `${returnUrl}?page=${page}&&limit=${limit}`,
    }),
    confirmReturnOrderStatus: builder.mutation({
      query: ({ orderId, itemId, status }) => ({
        url: `${returnUrl}/${orderId}/items/${itemId}/confirm`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useConfirmReturnOrderStatusMutation,
  useGetAllReturnOrdersQuery,
  useLazyGetAllReturnOrdersQuery
} = returnOrdersApiSlice;
