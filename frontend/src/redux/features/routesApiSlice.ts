import { Route } from "@/maps/utils/route/route";
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
    // retrieveEvent: builder.query<Event, number>({
    //     query: (id) => `/events/${id}/`,
    // }),
    // createEvent: builder.mutation<Event, CreateEventArgs>({
    //     query: (data) => ({
    //         url: '/events/create/',
    //         method: 'POST',
    //         body: data,
    //     }),
    // }),
    // updateEvent: builder.mutation<Event, UpdateEventArgs>({
    //     query: ({ id, ...data }) => ({
    //         url: `/update/${id}/`,
    //         method: 'PUT',
    //         body: data,
    //     }),
    // }),
    // deleteEvent: builder.mutation<void, number>({
    //     query: (id) => ({
    //         url: `/events/delete/${id}/`,
    //         method: 'DELETE',
    //     }),
    // }),
  }),
});

export const { useSaveRouteQuery } = eventsApiSlice;
