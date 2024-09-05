import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";
import { SetCustomersList } from "./customersSlice";

const CustomerUrl = `/admin/customers`;
const customersApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomersList: builder.query({
      query: ({ currentPage, itemsPerPage }) =>
        `${CustomerUrl}/get-customers?page=${currentPage}&limit=${itemsPerPage}`,
      // This is correct for caching and invalidation
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // Await the response from the API call
          const res = await queryFulfilled;
          console.log("Response from get all customers ", res.data);

          const { customers } = res.data;

          // Dispatch the action to update the state with customers data
          dispatch(SetCustomersList([...customers]));
        } catch (error) {
          // Log any errors that occur during the API call
          console.error("Error in get customer list API call:", error);
        }
      },
    }),
    updateCustomerIsBlocked: builder.mutation({
      query: (data) => ({
        url: `${CustomerUrl}/update-customer-isBlocked`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export the hook for use in components
export const {
  useLazyGetCustomersListQuery,
  useUpdateCustomerIsBlockedMutation,
} = customersApiSlice;
