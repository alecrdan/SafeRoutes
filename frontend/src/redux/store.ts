import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import authReducer from "./features/authSlice";
import selectedRoutesReducer from "./features/routes/selectedRouteSlice";
import focusedRoutesReducer from "./features/routes/focusedRouteSlice";
import routeCreationReducer from "./features/routes/routeCreationSlice";
import featureReducer from "./features/routes/featureSlice";

export const store = configureStore({
  reducer: {
    // Map
    features: featureReducer,
    focusedRoutes: focusedRoutesReducer,
    selectedRoutes: selectedRoutesReducer,
    routeCreation: routeCreationReducer,

    // Auth
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<(typeof store)["getState"]>;
export type AppDispatch = (typeof store)["dispatch"];
