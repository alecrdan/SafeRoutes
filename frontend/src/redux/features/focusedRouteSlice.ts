import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FocusedRouteState {
  [routeId: string]: string[];
}

const initialState: FocusedRouteState = {};

const focusedRouteSlice = createSlice({
  name: "focusedRoutes",
  initialState,
  reducers: {
    addFeature(
      state,
      action: PayloadAction<{ routeId: string; featureId: string }>
    ) {
      const { routeId, featureId } = action.payload;
      if (!state[routeId]) state[routeId] = [];
      if (!state[routeId].includes(featureId)) {
        state[routeId].push(featureId);
      }
    },
    removeFeature(
      state,
      action: PayloadAction<{ routeId: string; featureId: string }>
    ) {
      const { routeId, featureId } = action.payload;
      state[routeId] = (state[routeId] || []).filter((id) => id !== featureId);
      if (state[routeId].length === 0) {
        delete state[routeId];
      }
    },
    clearRoutes(state) {
      return {};
    },
  },
});

export const { addFeature, removeFeature, clearRoutes } =
  focusedRouteSlice.actions;
export default focusedRouteSlice.reducer;
