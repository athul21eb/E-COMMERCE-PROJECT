import userApiSlice from "../../../app/api/user/userApiSlice.js";
import { setCart } from "./cartSlice.js";
const userUrl = "/user/cart";

const cartApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getCart query
    getCart: builder.query({
      query: () => `${userUrl}/get-cart`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          const { cart } = res.data;

          dispatch(setCart(cart));
        } catch (error) {
          console.error("Error in get cart list API call:", error);
        }
      },
    }),
    // addToCart mutation
    addToCart: builder.mutation({
      query: (data) => ({
        url: `${userUrl}/add-to-cart`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { cart } = res.data;
          dispatch(setCart(cart));
        } catch (error) {
          console.error("Error in add  cart list API call:", error);
        }
      },
    }),
    removeFromCart: builder.mutation({
      query: ({ itemId }) => ({
        url: `${userUrl}/remove-from-cart/${itemId}`,
        method: "delete",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { cart } = res.data;
          dispatch(setCart(cart));
        } catch (error) {
          console.error("Error in remove item  cart list API call:", error);
        }
      },
    }),
    updateToCart: builder.mutation({
      query: ({ data, itemId }) => ({
        url: `${userUrl}/update-cart/${itemId}`,
        method: "PUT",
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { cart } = res.data;
          dispatch(setCart(cart));
        } catch (error) {
          console.error("Error in update  cart list API call:", error);
        }
      },
    }),
  }),
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateToCartMutation,
} = cartApiSlice;
