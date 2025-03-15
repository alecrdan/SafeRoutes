import { apiSlice } from '../services/apiSlice';

export interface Event {
    id: number;
    title: string;
    location: string;
    description?: string;
    event_time: string;
    likes: number;
    published_date: string;
    img?: string;
    created_by: number;
}

interface CreateEventArgs {
    title: string;
    location: string;
    description?: string;
    event_time: string;
    img?: File | null;
}

interface UpdateEventArgs extends Partial<CreateEventArgs> {
    id: number;
}

const eventsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        listEvents: builder.query<Event[], void>({
            query: () => '/events/',
        }),
        retrieveEvent: builder.query<Event, number>({
            query: (id) => `/events/${id}/`,
        }),
        createEvent: builder.mutation<Event, CreateEventArgs>({
            query: (data) => ({
                url: '/events/create/',
                method: 'POST',
                body: data,
            }),
        }),
        updateEvent: builder.mutation<Event, UpdateEventArgs>({
            query: ({ id, ...data }) => ({
                url: `/update/${id}/`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteEvent: builder.mutation<void, number>({
            query: (id) => ({
                url: `/events/delete/${id}/`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useListEventsQuery,
    useRetrieveEventQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = eventsApiSlice;
