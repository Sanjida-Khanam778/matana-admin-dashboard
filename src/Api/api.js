import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://matanashopapi.theirin.space/api",
  prepareHeaders: (headers, { getState }) => {
    // Add stored access token so protected endpoints succeed
    const token = getState()?.auth?.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const api = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "users",
    "auth",
    "stats",
    "marketing",
    "transactions",
    "payments",
    "business",
    "category",
    "community",
    "map-community",
    "profile",
    "messages",
    "plans",
    "website-visitors",
  ],
  endpoints: () => ({}),
});