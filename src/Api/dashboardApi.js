import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformAdminStats: builder.query({
      query: () => ({
        url: "platform/admin/stats/",
        method: "GET",
      }),
      providesTags: ["stats"],
    }),

    getMonthlyRevenueStats: builder.query({
      query: () => ({
        url: "adminapi/revenue-Monthly-stats/",
        method: "GET",
      }),
      providesTags: ["revenue"],
    }),

    getUserMonthlyStats: builder.query({
      query: () => ({
        url: "adminapi/user-Monthly-stats/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getUserDetails: builder.query({
      query: (userId) => ({
        url: `adminapi/user/${userId}/`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "users", id: userId }],
    }),

    getUserStats: builder.query({
      query: (userId) => ({
        url: `adminapi/user-stats/${userId}/`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "user-stats", id: userId },
      ],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `platform/admin/users/delete/${userId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    // Block/unblock user
    blockPlatformUser: builder.mutation({
      // expects { userId, status } as param, PATCH to /platform/admin/block-user/:userId/
      query: ({ userId, status }) => ({
        url: `platform/admin/block-user/${userId}/`,
        method: "PATCH",
        body: { is_blocked: status },
      }),
      invalidatesTags: ["users"],
    }),

    withdrawEarnings: builder.mutation({
      query: (data) => ({
        url: `platform/admin/withdrawals/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transactions"],
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `platform/admin/transactions/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["transactions"],
    }),

    updateCommission: builder.mutation({
      query: (data) => ({
        url: `platform/commision/list/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["commission"],
    }),

    // Platform user endpoints
    getPlatformDrivers: builder.query({
      query: () => ({
        url: "platform/admin/drivers/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getPlatformNormalUsers: builder.query({
      query: () => ({
        url: "platform/admin/normal-users/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getPlatformNewDriverRequests: builder.query({
      query: () => ({
        url: "platform/admin/new-driver-requests/",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    // Trips endpoint for admin trip tracking
    getPlatformTrips: builder.query({
      query: (params) => {
        const qs =
          params && Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : "";
        return {
          url: `platform/admin/trips/${qs}`,
          method: "GET",
        };
      },
      providesTags: ["trips"],
    }),

    // Notifications endpoint
    getPlatformNotifications: builder.query({
      query: () => ({
        url: `platform/admin/notifications/`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `platform/admin/notifications/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Transactions (Earnings) endpoint
    getPlatformTransactions: builder.query({
      query: () => ({
        url: "platform/admin/transactions/",
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),

    getPlatformPayments: builder.query({
      query: (params) => {
        const qs =
          params && Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : "";

        return {
          url: `platform/admin/payments/${qs}`,
          method: "GET",
        };
      },
      providesTags: ["payments"],
    }),

    // About Us endpoints
    getPlatformAboutUs: builder.query({
      query: () => ({
        url: "platform/about-us/",
        method: "GET",
      }),
      providesTags: ["about"],
    }),

    updatePlatformAboutUs: builder.mutation({
      query: (payload) => ({
        url: "platform/about-us/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["about"],
    }),

    getPlatformPrivacyPolicy: builder.query({
      query: () => ({
        url: "platform/privacy-and-policy/",
        method: "GET",
      }),
      providesTags: ["privacy"],
    }),

    updatePlatformPrivacyPolicy: builder.mutation({
      query: (payload) => ({
        url: "platform/privacy-and-policy/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["privacy"],
    }),

    // Terms & Conditions endpoints
    getPlatformTermsAndConditions: builder.query({
      query: () => ({
        url: "platform/terms-and-conditions/",
        method: "GET",
      }),
      providesTags: ["terms"],
    }),

    updatePlatformTermsAndConditions: builder.mutation({
      query: (payload) => ({
        url: "platform/terms-and-conditions/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["terms"],
    }),

    getPlatformMarketingPages: builder.query({
      query: (params) => {
        const qs =
          params && Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : "";

        return {
          url: `platform/marketing/${qs}`,
          method: "GET",
        };
      },
      providesTags: ["marketing"],
    }),

    createPlatformMarketingPage: builder.mutation({
      query: (payload) => ({
        url: "platform/marketing/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["marketing"],
    }),

    updatePlatformMarketingPage: builder.mutation({
      query: ({ id, payload }) => ({
        url: `platform/marketing/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["marketing"],
    }),

    deletePlatformMarketingPage: builder.mutation({
      query: (id) => ({
        url: `platform/marketing/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["marketing"],
    }),

    // Admin change password
    updatePlatformAdminPassword: builder.mutation({
      query: (payload) => ({
        url: "platform/admin/password/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [],
    }),

    // Admin profile endpoints
    getPlatformAdminProfile: builder.query({
      query: () => ({
        url: "platform/admin/profile/",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updatePlatformAdminProfile: builder.mutation({
      query: (payload) => ({
        url: "platform/admin/profile/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["profile"],
    }),

    // Trip detail endpoint
    getPlatformTripById: builder.query({
      query: (id) => ({
        url: `platform/admin/trips/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "trips", id }],
    }),

    // Driver trip history endpoint
    getPlatformDriverTrips: builder.query({
      query: (driverId) => ({
        url: `platform/admin/driver-trips/${driverId}/`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "trips", id: driverId },
      ],
    }),

    // Individual detail endpoints
    getPlatformUserById: builder.query({
      query: (id) => ({
        url: `platform/admin/users/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "users", id }],
    }),
    getPlatformDriverById: builder.query({
      query: (id) => ({
        url: `platform/admin/drivers/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "users", id }],
    }),

    // Approve / Reject driver application
    approvePlatformDriver: builder.mutation({
      query: ({ driverId, action }) => ({
        url: `platform/admin/approve-driver/${driverId}/`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["users"],
    }),

    // Fallback/all users (existing)
    getUsers: builder.query({
      query: () => ({
        url: `platform/admin/users/`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),



    // Businesses list
    getBusinessesList: builder.query({
      query: () => ({
        url: "admin/businesses/list/",
        method: "GET",
      }),
      providesTags: ["business"],
    }),

    // Approve a business
    approveBusiness: builder.mutation({
      query: (id) => ({
        url: `admin/business/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["business"],
    }),

    // Reject a business
    rejectBusiness: builder.mutation({
      query: (id) => ({
        url: `admin/business/${id}/reject/`,
        method: "POST",
      }),
      invalidatesTags: ["business"],
    }),

    // Update a business
    updateBusiness: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `admin/business/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["business"],
    }),

    // Delete a business
    deleteBusiness: builder.mutation({
      query: (id) => ({
        url: `admin/business/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["business"],
    }),

    // Get categories
    getCategories: builder.query({
      query: () => ({
        url: "categories/",
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    // Create a category
    createCategory: builder.mutation({
      query: (body) => ({
        url: "categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["category"],
    }),

    // Delete a category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    // Upload a media file
    uploadMedia: builder.mutation({
      query: (formData) => ({
        url: "media/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetPlatformAdminStatsQuery,
  useGetMonthlyRevenueStatsQuery,
  useGetUserMonthlyStatsQuery,
  useGetPlatformDriversQuery,
  useGetPlatformNormalUsersQuery,
  useGetPlatformNewDriverRequestsQuery,
  useGetPlatformUserByIdQuery,
  useGetPlatformDriverByIdQuery,
  useApprovePlatformDriverMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useGetUserStatsQuery,
  useDeleteUserMutation,
  useBlockPlatformUserMutation,
  useWithdrawEarningsMutation,
  useDeleteTransactionMutation,
  useUpdateCommissionMutation,
  useGetPlatformTripsQuery,
  useGetPlatformTripByIdQuery,
  useGetPlatformDriverTripsQuery,
  useGetPlatformTransactionsQuery,
  useGetPlatformPaymentsQuery,
  useGetPlatformNotificationsQuery,
  useDeleteNotificationMutation,
  useGetPlatformAboutUsQuery,
  useUpdatePlatformAboutUsMutation,
  useGetPlatformPrivacyPolicyQuery,
  useUpdatePlatformPrivacyPolicyMutation,
  useGetPlatformTermsAndConditionsQuery,
  useUpdatePlatformTermsAndConditionsMutation,
  useGetPlatformMarketingPagesQuery,
  useCreatePlatformMarketingPageMutation,
  useUpdatePlatformMarketingPageMutation,
  useDeletePlatformMarketingPageMutation,
  useUpdatePlatformAdminPasswordMutation,
  useGetPlatformAdminProfileQuery,
  useUpdatePlatformAdminProfileMutation,
  useGetCommisionRateQuery,
  useGetBusinessesListQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadMediaMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} = authApi;
