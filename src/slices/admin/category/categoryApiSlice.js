import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";
import { setCategoriesList } from "./categoryListSlice";


const CategoryUrl = `/admin/categories`;

const categoryApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriesList: builder.query({
      query: ({currentPage,itemsPerPage}) => `${CategoryUrl}/get-categories?page=${currentPage}&limit=${itemsPerPage}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          console.log("Response from get all categories:", res.data);

          const { categories } = res.data;

          // Dispatch the action to update the state with categories data
          dispatch(setCategoriesList([...categories]));

        } catch (error) {

          console.error("Error in get categories list API call:", error);
       
        }
      },
    }),
    getAllCategories: builder.query({
      query: () =>
        `${CategoryUrl}/get-all-categories`,
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CategoryUrl}/update-category`,
        method: "PUT",
        body: data,
      }),
    }),
    toggleCategoryIsActive: builder.mutation({
      query: (data) => ({
        url: `${CategoryUrl}/update-category-IsActive`,
        method: "PATCH",
        body: data,
      }),
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${CategoryUrl}/create-category`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export the hooks for use in components
export const {
  useGetCategoriesListQuery,
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoriesListQuery,
  useUpdateCategoryMutation,
  useToggleCategoryIsActiveMutation,
  useAddCategoryMutation,
} = categoryApiSlice;

