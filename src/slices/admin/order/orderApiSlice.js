import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";

const orderUrl = "/admin/orders";

const adminOrderApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ itemsPerPage, currentPage }) => ({
        url: `${orderUrl}?page=${currentPage}&limit=${itemsPerPage}`,
      }),
    }),
    getOrderByIdFromAllOrders: builder.query({
      query: (id) => ({
        url: `${orderUrl}/${id}`,
      }),
    }),
    updateOrderItemStatus: builder.mutation({
      query: ({ orderId, itemId, status }) => ({
        url: `${orderUrl}/${orderId}/items/${itemId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    getSaleReport: builder.query({
      query: ({ itemsPerPage, currentPage, startDate, endDate, period }) => ({
        url: `${orderUrl}/salesReport?page=${currentPage}&limit=${itemsPerPage}&period=${period}&startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getFullSaleReport: builder.query({
      query: () => `${orderUrl}/salesReport-download`,
    }),
  }),
});

export const {
  useLazyGetAllOrdersQuery,
  useLazyGetOrderByIdFromAllOrdersQuery,
  useUpdateOrderItemStatusMutation,
  useLazyGetSaleReportQuery,
  useLazyGetFullSaleReportQuery
} = adminOrderApiSlice;
