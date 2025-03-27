function convertToGpx(
  routes: Record<string, { geometry: { coordinates: number[][] } }[]>,
  name = "Exported Routes"
): string {
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
}

function getSelectedRoutes(mapInstance: any, selectedRoutes: any) {
  const geojsonRoutes: Record<
    string,
    { geometry: { coordinates: number[][] } }[]
  > = {};

  const firstRouteEntry = Object.entries(selectedRoutes)[0];

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

  const sourceData: any = source._data || source.serialize()?.data;

  if (!sourceData?.features?.[0]?.geometry?.coordinates) {
    console.warn("Invalid source data format.");
    return;
  }

  geojsonRoutes[routeId] = [
    {
      geometry: {
        coordinates: sourceData.features[0].geometry.coordinates,
      },
    },
  ];

  return geojsonRoutes;
}

function exportSelectedRoutes(mapInstance: any, selectedRoutes: any) {
  const geojsonRoutes = getSelectedRoutes(mapInstance, selectedRoutes);
  if (!geojsonRoutes) return;

  const gpxData = convertToGpx(geojsonRoutes);
  const blob = new Blob([gpxData], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "routes.gpx";
  link.click();
}

export { convertToGpx, getSelectedRoutes, exportSelectedRoutes };
