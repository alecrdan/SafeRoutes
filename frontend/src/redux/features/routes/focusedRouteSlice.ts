import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const focusedFeaturesSlice = createSlice({
  name: "focusedFeatures",
  initialState,
  reducers: {
    addFeatureIds(state, action: PayloadAction<string[]>) {
      action.payload.forEach((featureId) => {
        if (!state.includes(featureId)) {
          state.push(featureId);
        }
      });
    },
    removeFeatureId(state, action: PayloadAction<string>) {
      return state.filter((id) => id !== action.payload);
    },
    clearFeatureIds() {
      return [];
    },
  },
});

export const { addFeatureIds, removeFeatureId, clearFeatureIds } =
  focusedFeaturesSlice.actions;
export default focusedFeaturesSlice.reducer;
export const containsFeatureId = (
  state: RootState,
  featureId: string
): boolean => state.focusedRoutes.includes(featureId);
