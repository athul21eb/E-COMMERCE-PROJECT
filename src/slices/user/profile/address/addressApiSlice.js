import userApiSlice from "../../../../app/api/user/userApiSlice.js";
import { SetCredentials } from "../../../auth/authSlice.js";
import { setAddresses } from "./addressSlice.js";

const addressUrl = "/user/profile/addresses";

const addressApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //// getAddresses query
    getAddresses: builder.query({
      query: () => `${addressUrl}/`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { addresses } = res.data;
          dispatch(setAddresses(addresses));
        } catch (error) {
          console.error("Error in get addresses API call:", error);
        }
      },
    }),
    //// addAddress mutation
    addAddress: builder.mutation({
      query: (data) => ({
        url: `${addressUrl}/add`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { addresses } = res.data;
          dispatch(setAddresses(addresses));
        } catch (error) {
          console.error("Error in add address API call:", error);
        }
      },
    }),
    //// updateAddress mutation
    updateAddress: builder.mutation({
      query: ({ data, addressId }) => ({
        url: `${addressUrl}/update/${addressId}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { addresses } = res.data;
          dispatch(setAddresses(addresses));
        } catch (error) {
          console.error("Error in update address API call:", error);
        }
      },
    }),
    //// setDefaultAddress mutation
    setDefaultAddress: builder.mutation({
      query: ({ addressId }) => ({
        url: `${addressUrl}/set-default/${addressId}`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { addresses } = res.data;
          dispatch(setAddresses(addresses));
        } catch (error) {
          console.error("Error in set default address API call:", error);
        }
      },
    }),
    //// deleteAddress mutation
    deleteAddress: builder.mutation({
      query: ({ addressId }) => ({
        url: `${addressUrl}/delete/${addressId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          const { addresses } = res.data;
          dispatch(setAddresses(addresses));
        } catch (error) {
          console.error("Error in delete address API call:", error);
        }
      },
    }),
    ////get address by Id
    getAddressById: builder.query({
      query: ({ id }) => `${addressUrl}/${id}`,
    }),
    /////update user Overview
    updateUserDetails: builder.mutation({
      query: (data) => ({
        url: `/user/profile/overview`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          
          const { firstName, lastName, DOB, mobile_no, photo } =
            res.data?.user;
           
           


            dispatch(SetCredentials({
              
              firstName,
              lastName,
              DOB,
              mobile_no,
              photo
            }));
            
        } catch (error) {
          console.error("Error in use updateAPI call:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useLazyGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
  useLazyGetAddressByIdQuery,
  useUpdateUserDetailsMutation,
} = addressApiSlice;
