// Import the slice for brand state management


import { toast } from "react-toastify";
import { apiSlice } from "../../app/api/auth/authenticationApiSlice";
import { setPublicProducts } from "./publicSlice";

const publicUrl = `/public`;

const PubicSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrandsList: builder.query({
      query: () => `${publicUrl}/get-brands`,
    }),
    getNewArrivals:builder.query({
      query: ({limit}) => `${publicUrl}/new-arrivals?limit=${limit}`
    }),
    getProductDetailsById: builder.query({
      query: ({ id }) => `${publicUrl}/get-product/${id}`,
    }),
    getProductListWithFiltersAndSort: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        selectedBrands = '', 
        minPrice = 500, 
        maxPrice = 40000, 
        sortBy = '', 
        search = '', 
        selectedCategoryName = '' 
      }) => {
        // Build the query string with the provided filter parameters
        const queryParams = new URLSearchParams({
          page,
          limit,
          selectedBrands,
          minPrice,
          maxPrice,
          sortBy,
          search,
          selectedCategoryName
        }).toString();
    
        return `${publicUrl}/get-products?${queryParams}`;
      },
      
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
         
          const { products } = res.data;
    
          // Dispatch the action to update the state with products data
          dispatch(setPublicProducts([...products]));
        } catch (error) {
          console.error("Error in get products list API call:", error);
          
          dispatch(setPublicProducts([]));
        }
      },
    }),
    
  }),
});

export const {
  useLazyGetAllBrandsListQuery,
  useGetAllBrandsListQuery,
  useLazyGetProductDetailsByIdQuery,
useGetProductListWithFiltersAndSortQuery,
  
  
  useGetNewArrivalsQuery,
} = PubicSlice;
