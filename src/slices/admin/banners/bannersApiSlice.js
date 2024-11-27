
import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";

const adminBannerUrl = `/admin/banners`;
const bannerApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBannersList: builder.query({
      query: ({ page=1, limit=1 }) =>
        `${adminBannerUrl}/get-banners?page=${page}&limit=${limit}`,
    }),
    getOfferProducts: builder.query({
      query: () => `${adminBannerUrl}/offer-products`,
    }),
    toggleBannerIsActive: builder.mutation({
      query: (data) => ({
        url: `${adminBannerUrl}/update-banner-isActive`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateBanner: builder.mutation({
      query: (data) => ({
        url: `${adminBannerUrl}/update-banner`,
        method: "PUT",
        body: data,
      }),
    }),
    addBanner: builder.mutation({
      query: (data) => ({
        url: `${adminBannerUrl}/create-banner`,
        method: "POST",
        body: data,
      }),
    }),
    deleteBanner: builder.mutation({
      query: (data) => ({
        url: `${adminBannerUrl}/delete-banner`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddBannerMutation,

  useDeleteBannerMutation,
  useLazyGetBannersListQuery,
  useToggleBannerIsActiveMutation,
  useUpdateBannerMutation,
  useGetOfferProductsQuery
} = bannerApiSlice;
