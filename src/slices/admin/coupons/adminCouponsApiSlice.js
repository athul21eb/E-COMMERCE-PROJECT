import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";

const couponUrl = "/admin/coupons";

const adminCouponApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to get all coupons
    getCoupons: builder.query({
      query: () => ({
        url: `${couponUrl}`,
        method: "GET",
      }),
    }),

    // Endpoint to add a new coupon
    addCoupon: builder.mutation({
      query: (couponData) => ({
        url: `${couponUrl}/add`,
        method: "POST",
        body: couponData,
      }),
    }),

    // Endpoint to delete a coupon by ID
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${couponUrl}/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useAddCouponMutation,
  useDeleteCouponMutation,
} = adminCouponApiSlice;


