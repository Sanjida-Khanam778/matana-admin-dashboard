import { api } from "./api";

export const businessDirectoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/plans/",
      providesTags: ["plans"],
    }),
    updatePlan: builder.mutation({
      query: ({ id, tier, base_price }) => ({
        url: `/plans/${id}/`,
        method: "PATCH",
        body: { tier, base_price },
      }),
      invalidatesTags: ["plans"],
    }),
    getCategories: builder.query({
      query: () => "/categories/",
    }),
    getCommunities: builder.query({
      query: () => "/communities/",
    }),
    getStats: builder.query({
      query: () => "/stats/",
    }),
    getOrderSummary: builder.query({
      query: ({ plan_id, duration_months, payment_type }) => ({
        url: "/business/order-summary/",
        params: { plan_id, duration_months, payment_type },
      }),
    }),
    uploadMedia: builder.mutation({
      query: (formData) => ({
        url: "/media/",
        method: "POST",
        body: formData,
      }),
    }),
    registerBusiness: builder.mutation({
      query: (body) => ({
        url: "/business/register/",
        method: "POST",
        body,
      }),
    }),
    getCommunityStoresByCity: builder.query({
      query: (cityName) => `/communities/${cityName}/`,
    }),
    getCategoryStores: builder.query({
      query: (categoryId) => `/categories/${categoryId}/`,
    }),
    getMapCommunities: builder.query({
      query: () => "/add-communities/to/map/",
    }),
    getBusinessDetails: builder.query({
      query: (id) => `/businesses/${id}/`,
    }),
    getTags: builder.query({
      query: () => "/business/tags/",
    }),
    filterBusinesses: builder.query({
      query: ({ categories, services_tags, locations }) => {
        const params = new URLSearchParams();
        if (categories) params.append("categories", categories);
        if (services_tags) params.append("services_tags", services_tags);
        if (locations) params.append("locations", locations);
        return `/business/filter/?${params.toString()}`;
      },
    }),
    getWebsiteVisitors: builder.query({
      query: () => "/website-visitors/",
      providesTags: ["website-visitors"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetCategoriesQuery,
  useGetCommunitiesQuery,
  useGetCommunityStoresByCityQuery,
  useGetCategoryStoresQuery,
  useGetMapCommunitiesQuery,
  useGetBusinessDetailsQuery,
  useGetStatsQuery,
  useGetOrderSummaryQuery,
  useGetTagsQuery,
  useFilterBusinessesQuery,
  useUploadMediaMutation,
  useRegisterBusinessMutation,
  useUpdatePlanMutation,
  useGetWebsiteVisitorsQuery,
} = businessDirectoryApi;
