import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";
import { setProductList } from "./productListSlice"; // Import the slice for product state management

const ProductUrl = `/admin/products`;

const productApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: ({itemsPerPage,currentPage}) => `${ProductUrl}/get-products?page=${currentPage}&limit=${itemsPerPage}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from get all products:", res.data);

          const { products } = res.data;

          // Dispatch the action to update the state with products data
          dispatch(setProductList([...products]));

        } catch (error) {
          console.error("Error in get products list API call:", error);
        }
      },
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${ProductUrl}/update-product`,
        method: "PUT",
        body: data,
      }),
    }),
    toggleProductIsActive: builder.mutation({
      query: (data) => ({
        url: `${ProductUrl}/update-product-IsActive`,
        method: "PATCH",
        body: data,
      }),
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${ProductUrl}/create-product`,
        method: "POST",
        body: data,
      }),
    }),
    getProductById:builder.query({
      
      query: (id) => `${ProductUrl}/get-product/${id}`
    })
  }),
});

// Export the hooks for use in components
export const {
  useGetProductListQuery,
  useLazyGetProductListQuery,
  useLazyGetProductByIdQuery,
  useUpdateProductMutation,
  useToggleProductIsActiveMutation,
  useAddProductMutation,
} = productApiSlice;
