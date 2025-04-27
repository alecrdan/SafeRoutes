// src/redux/features/routesSlice.ts
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { MapFeature } from "@/maps/utils/schemas/feature/feature";

/**
 * Define the shape of a Route in your store.
 */
/**
 * Use an entity adapter for normalized CRUD.
 */
const adapter = createEntityAdapter<MapFeature>();

export const {
  selectAll: selectAllRoutes,
  selectById: selectRouteById,
  selectEntities: selectRouteEntities,
  selectIds: selectRouteIds,
  selectTotal: selectTotalRoutes,
} = adapter.getSelectors<RootState>((state) => state.features);

const routesSlice = createSlice({
  name: "routes",
  initialState: adapter.getInitialState(),
  reducers: {
    /**
     * Add a single route
     */
    addRoute: adapter.addOne,

    /**
     * Upsert (add or update) a route
     */
    upsertRoute: adapter.upsertOne,

    /**
     * Replace all routes in the store
     */
    setRoutes(state, action: PayloadAction<MapFeature[]>) {
      adapter.setAll(state, action.payload);
    },

    /**
     * Update fields of an existing route
     */
    updateRoute(
      state,
      action: PayloadAction<{ id: string; changes: Partial<MapFeature> }>
    ) {
      adapter.updateOne(state, action.payload);
    },

    /**
     * Remove a route by ID
     */
    removeRoute: adapter.removeOne,

    /**
     * Clear out all routes
     */
    clearRoutes: adapter.removeAll,
  },
});

export const {
  addRoute,
  upsertRoute,
  setRoutes,
  updateRoute,
  removeRoute,
  clearRoutes,
} = routesSlice.actions;

export default routesSlice.reducer;
