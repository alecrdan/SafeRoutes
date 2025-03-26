import { Route } from "@/maps/utils/schemas/route/route";
import { apiSlice } from "../services/apiSlice";

const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveRoute: builder.query<Route, void>({
      query: (data) => ({
        url: "/routes/",
        method: "POST",
        body: data,
      }),
    }),
    getRoutes: builder.query<Route[], void>({
      query: (data) => ({
        url: "/routes/",
        method: "GET",
        body: data,
      }),
    }),
    getRoute: builder.query<number, Route>({
      query: (id) => ({
        url: `/route/${id}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSaveRouteQuery, useGetRouteQuery, useGetRoutesQuery } =
  eventsApiSlice;
