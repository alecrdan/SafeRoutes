"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Map from "../../../maps/map/map-instance";

const convertToGPX = (
  routes: Record<string, { geometry: { coordinates: number[][] } }[]>,
  name = "Exported Routes"
) => {
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SafeRoutes - Alec Daniels"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1
     http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata><name>${name}</name></metadata>`;

  const gpxTracks = Object.values(routes)
    .flat()
    .map((route, index) => {
      const points = route.geometry.coordinates
        .map(([lon, lat]) => `<trkpt lon="${lon}" lat="${lat}"></trkpt>`)
        .join("\n");

      return `<trk><name>Route ${
        index + 1
      }</name><trkseg>${points}</trkseg></trk>`;
    })
    .join("\n");

  const gpxFooter = `</gpx>`;
  return `${gpxHeader}\n${gpxTracks}\n${gpxFooter}`;
};

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

    const geojsonRoutes: Record<
      string,
      { geometry: { coordinates: number[][] } }[]
    > = {};

    const firstRouteEntry = Object.entries(selectedRoutes)[0]; // Get the first [routeId, featureIds] pair

    if (!firstRouteEntry) {
      console.warn("No routes selected.");
      return;
    }

    const [routeId, featureIds] = firstRouteEntry;
    const source = mapInstance.getSource(routeId) as mapboxgl.GeoJSONSource;

    if (!source) {
      console.warn(`Source for ${routeId} not found.`);
      return;
    }

    const sourceData = source._data || source.serialize()?.data;
    console.log(sourceData.features[0].geometry.coordinates);

    // You could optionally store it in geojsonRoutes if needed for GPX conversion
    geojsonRoutes[routeId] = [
      {
        geometry: {
          coordinates: sourceData.features[0].geometry.coordinates,
        },
      },
    ];

    const gpxData = convertToGPX(geojsonRoutes);
    const blob = new Blob([gpxData], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "routes.gpx";
    link.click();
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
