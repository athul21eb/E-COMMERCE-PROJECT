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
    updateOrderItemStatus:builder.mutation({
        query: ({orderId,itemId,status})=>({
          url:`${orderUrl}/${orderId}/items/${itemId}/status`,
          method:"PATCH",
          body:{status},
        })
      })
  
  }),
});

export const {

    useLazyGetAllOrdersQuery,
    useLazyGetOrderByIdFromAllOrdersQuery,
    useUpdateOrderItemStatusMutation
 
} = adminOrderApiSlice;
