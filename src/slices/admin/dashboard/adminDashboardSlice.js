import { adminApiSlice } from "../../../app/api/admin/adminApiSlice";

const dashBoardURL = "/admin/dashboard";

const adminDashBoardSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashBoardSummary: builder.query({
      query: ({ period, startDate, endDate }) => ({
        url: `${dashBoardURL}/summary?filter=${period}&startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getGraphData: builder.query({
      query: ({ period}) => ({
        url: `${dashBoardURL}/bar-graph?period=${period}`,
      }),
    }),
  }),
});

export const { useLazyGetDashBoardSummaryQuery ,useGetGraphDataQuery } = adminDashBoardSlice;
