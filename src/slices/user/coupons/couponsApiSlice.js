
import userApiSlice from "../../../app/api/user/userApiSlice";
import { setCart } from "../cart/cartSlice";

const couponUrl = "/user/coupon";
const couponApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => `${couponUrl}/get-coupons`,
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: `${couponUrl}/apply-coupon`,
        method: "POST",
        body: data,
        
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          const { cart } = res.data;

          dispatch(setCart(cart));
        } catch (error) {
          console.error("Error in get cart list from coupon API call:", error);
        }
      },
    }),
    removeCoupon: builder.mutation({
      query: () => ({
        url:`${couponUrl}/remove-coupon`,
        method:"DELETE"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          const { cart } = res.data;

          dispatch(setCart(cart));
        } catch (error) {
          console.error("Error in get cart list from coupon API call:", error);
        }
      },
    }),
  }),
});

export const {
  useApplyCouponMutation,
  useGetCouponsQuery,
  useRemoveCouponMutation,
} = couponApiSlice;
