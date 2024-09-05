import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";
import { setBrandsList } from "./brandsListSlice"; // Import the slice for brand state management

const BrandUrl = `/admin/brands`;

const brandApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrandsList: builder.query({
      query: ({ currentPage, itemsPerPage }) =>
        `${BrandUrl}/get-brands?page=${currentPage}&limit=${itemsPerPage}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          console.log("Response from get all brands:", res.data);

          const { brands } = res.data;

          // Dispatch the action to update the state with brands data
          dispatch(setBrandsList([...brands]));
        } catch (error) {
          console.error("Error in get brands list API call:", error);
        }
      },
    }),
    getAllBrands: builder.query({
      query: () =>
        `${BrandUrl}/get-all-brands`,
    }),
    updateBrand: builder.mutation({
      query: (data) => ({
        url: `${BrandUrl}/update-brand`,
        method: "PUT",
        body: data,
      }),
    }),
    toggleBrandIsActive: builder.mutation({
      query: (data) => ({
        url: `${BrandUrl}/update-brand-IsActive`,
        method: "PATCH",
        body: data,
      }),
    }),
    addBrand: builder.mutation({
      query: (data) => ({
        url: `${BrandUrl}/create-brand`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export the hooks for use in components
export const {
  useGetBrandsListQuery,
  useLazyGetAllBrandsQuery,
  useLazyGetBrandsListQuery,
  useUpdateBrandMutation,
  useToggleBrandIsActiveMutation,
  useAddBrandMutation,
} = brandApiSlice;
