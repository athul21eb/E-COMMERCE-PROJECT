import userApiSlice from "../../../app/api/user/userApiSlice";

const walletUrl = "/user/wallet";

const walletApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWalletDetails: builder.query({
      query: ({page=1,limit=10}) => `${walletUrl}?page=${page}&limit=${limit}`,
    }),
    createWallet: builder.mutation({
      query: (data) => ({
        url: `${walletUrl}/create`,
        method: "POST",
        body: data,
      }),
    }),
    addMoneyToWallet: builder.mutation({
      query: (data) => ({
        url: `${walletUrl}/add-money`,
        method: "POST",
        body: data,
      }),
    }),
    verifyPaymentForWallet: builder.mutation({
      query: (data) => ({
        url: `${walletUrl}/verify-payment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetWalletDetailsQuery,
  useAddMoneyToWalletMutation,
  useCreateWalletMutation,
  useVerifyPaymentForWalletMutation,
} = walletApiSlice;
