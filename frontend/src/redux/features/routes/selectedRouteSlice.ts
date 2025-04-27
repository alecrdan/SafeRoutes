import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedRouteState {
  [routeId: string]: string[];
}

const initialState: SelectedRouteState = {};

const selectedRouteSlice = createSlice({
  name: "selectedRoutes",
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
  selectedRouteSlice.actions;
export default selectedRouteSlice.reducer;
