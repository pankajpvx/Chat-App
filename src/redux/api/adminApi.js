import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import { transformImage } from "../../utils/features";

const adminApi = createApi({
  reducerPath: "admin",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  endpoints: (builder) => ({
    dashboardStats: builder.query({
      query: () => ({
        url: "admin/stats",
        credentials: "include",
      }),
    }),
    allUsers: builder.query({
      query: () => ({
        url: "admin/users",
        credentials: "include",
      }),
      transformResponse: (response) => {
        const { users, status, totalUsers } = response;
        const tranformedUsers = users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
        }));

        return {
          status,
          totalUsers,
          users: tranformedUsers,
        };
      },
    }),

    allChats: builder.query({
      query: () => ({
        url: "admin/chats",
        credentials: "include",
      }),
    }),
    allMessages: builder.query({
      query: () => ({
        url: "admin/messages",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useDashboardStatsQuery,
  useAllUsersQuery,
  useAllChatsQuery,
  useAllMessagesQuery,
} = adminApi;

export default adminApi;
