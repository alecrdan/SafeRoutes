import mapboxgl from "mapbox-gl";
import GeoPoint from "@/maps/utils/geo/GeoPoint";

export function getDirections(
  type: string,
  start: GeoPoint,
  end: GeoPoint,
  accessToken: string | null | undefined
): string {
  return `https://api.mapbox.com/directions/v5/mapbox/${type}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${accessToken}&overview=full`;
}

export async function fetchDirections(
  type: string,
  start: GeoPoint,
  end: GeoPoint
): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> {
  try {
    const url = getDirections(type, start, end, mapboxgl.accessToken);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.routes || json.routes.length === 0) {
      throw new Error("No routes found.");
    }

    const route = json.routes[0].geometry.coordinates;

    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}
