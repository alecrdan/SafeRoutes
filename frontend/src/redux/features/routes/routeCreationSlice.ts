import GeoPoint from '@/maps/utils/schemas/geo/GeoPoint';
import { createSlice } from '@reduxjs/toolkit';

interface RouteCreationState {
  isCreating: boolean;
  coordinates: GeoPoint[];
}

const initialState: RouteCreationState = {
  isCreating: false,
  coordinates: [],
};

const routeCreationSlice = createSlice({
  name: 'routeCreation',
  initialState,
  reducers: {
    startRouteCreation(state) {
      state.isCreating = true;
      state.coordinates = [];
    },
    addCoordinate(state, action) {
      state.coordinates.push(action.payload);
    },
    finishRouteCreation(state) {
      state.isCreating = false;
    },
    cancelRouteCreation(state) {
      state.isCreating = false;
      state.coordinates = [];
    },
    resetRouteCreation(state) {
        state.isCreating = false;
        state.coordinates = [];
      }
  },
});

export const { startRouteCreation, addCoordinate, finishRouteCreation, cancelRouteCreation, resetRouteCreation } = routeCreationSlice.actions;
export default routeCreationSlice.reducer;