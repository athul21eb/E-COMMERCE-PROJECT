import userApiSlice from "../../../app/api/user/userApiSlice";
import { setWishList } from "./wishListSlice";

// Base URL for wishlist API
const wishListUrl = '/user/wishlist/';

const wishListApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Wishlist
    getWishList: builder.query({
      query: () => wishListUrl,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { wishlist } = res.data;
          dispatch(setWishList(wishlist));
        } catch (error) {
          console.error("Error in get wishlist API call:", error);
        }
      },
    }),

    // Add to Wishlist
    addToWishlist: builder.mutation({
      query: ({productId}) => ({
        url: `${wishListUrl}add`,
        method: "POST",
        body: { productId },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { wishlist } = res.data;
          dispatch(setWishList(wishlist));
        } catch (error) {
          console.error("Error in add to wishlist API call:", error);
        }
      },
    }),

    // Remove from Wishlist
    removeFromWishlist: builder.mutation({
      query: ({productId}) => ({
        url: `${wishListUrl}remove/${productId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { wishlist } = res.data;
          dispatch(setWishList(wishlist));
        } catch (error) {
          console.error("Error in remove from wishlist API call:", error);
        }
      },
    }),
  }),
});

export const {
  useGetWishListQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishListApiSlice;


