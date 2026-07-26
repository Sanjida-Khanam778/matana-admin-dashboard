import { api } from "./api";

export const businessDirectoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/plans/",
    }),
    getCategories: builder.query({
      query: () => "/categories/",
    }),
    getCommunities: builder.query({
      query: () => "/communities/",
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
  }),
});

export const {
  useGetPlansQuery,
  useGetCategoriesQuery,
  useGetCommunitiesQuery,
  useUploadMediaMutation,
  useRegisterBusinessMutation,
} = businessDirectoryApi;
