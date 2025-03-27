"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Map from "../../../maps/map/map-instance";
import { exportSelectedRoutes } from "@/maps/utils/exportUtils";

const ExportButton = () => {
  const selectedRoutes = useSelector(
    (state: RootState) => state.selectedRoutes
  );

  const isExportVisible = Object.values(selectedRoutes).some(
    (featureList) => featureList.length > 0
  );

  if (!isExportVisible) return null;

  const handleExportClicked = async (): Promise<void> => {
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }
    exportSelectedRoutes(mapInstance, selectedRoutes);
  };

  return (
    <button
      onClick={handleExportClicked}
      className="flex w-full justify-center rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner focus:outline-none hover:bg-gray-600"
    >
      Export
    </button>
  );
};

export default ExportButton;
