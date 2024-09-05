// Import the slice for brand state management


import { apiSlice } from "../../app/api/auth/authenticationApiSlice";
import { setPublicProducts } from "./publicSlice";

const publicUrl = `/public`;

const PubicSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrandsList: builder.query({
      query: () => `${publicUrl}/get-brands`,
    }),
    getProductDetailsById: builder.query({
      query: ({ id }) => `${publicUrl}/get-product/${id}`,
    }),
    getAllProductList: builder.query({
      query: () => `${publicUrl}/get-products`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from get all products:", res.data);

          const { products } = res.data;

          // Dispatch the action to update the state with products data
          dispatch(setPublicProducts([...products]));
        } catch (error) {
          console.error("Error in get products list API call:", error);
        }
      },
    }),
  }),
});

export const {
  useLazyGetAllBrandsListQuery,
  useLazyGetProductDetailsByIdQuery,
  useLazyGetAllProductListQuery,
  useGetAllBrandsListQuery,
  useGetAllProductListQuery,
} = PubicSlice;
