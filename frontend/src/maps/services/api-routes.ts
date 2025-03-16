import GeoPoint from "../utils/geo/GeoPoint";

export function getDirections(
  type: string,
  start: GeoPoint,
  end: GeoPoint,
  accessToken: string | null | undefined
): string {
  return `https://api.mapbox.com/directions/v5/mapbox/${type}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${accessToken}`;
}

