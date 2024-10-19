import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";

const offerUrl = "/admin/offers";

const adminOfferApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to create a new offer
    createOffer: builder.mutation({
      query: (offerData) => ({
        url: `${offerUrl}/create`,
        method: "POST",
        body: offerData,
      }),
    }),

    // Endpoint to delete an offer by ID
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `${offerUrl}/delete/${id}`,
        method: "DELETE",
      }),
    }),

    // Endpoint to apply offer to a product 
    applyOfferToProduct: builder.mutation({
      query: ({ offerId, productId }) => ({
        url: `${offerUrl}/apply-to-product`,
        method: "POST",
        body: { offerId, productId },
      }),
    }),
    // Endpoint to apply offer to a   category
    applyOfferToCategory: builder.mutation({
      query: ({ offerId, categoryId }) => ({
        url: `${offerUrl}/apply-to-category`,
        method: "POST",
        body: { offerId, categoryId },
      }),
    }),

    // Endpoint to get offers by type (product or category)
    getOffersByType: builder.query({
      query: (offerType) => ({
        url: `${offerUrl}${offerType ? `?offerType=${offerType}` : "/"}`,
      }),
    }),
    
  }),
});

export const {
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useApplyOfferToProductMutation,
  useApplyOfferToCategoryMutation,
useGetOffersByTypeQuery,
  useLazyGetOffersByTypeQuery ,
} = adminOfferApiSlice;
