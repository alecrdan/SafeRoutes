import Map from "../map/map-instance";
import GeoPoint from "../utils/geo/GeoPoint";
import mapboxgl from "mapbox-gl";
import MapRoute from "./create-route";

const handleSearchFlyTo = (coords: GeoPoint | null) => {
  const mapInstance = Map.getInstance()?.getMap();

  if (!mapInstance) {
    console.error("Map instance is not initialized yet.");
    return;
  }

  // if (coords) {
  //   // Add point
  //   new MapRoute().constructMarker(mapInstance, "search-marker", coords);

  //   // Fly to
  //   mapInstance.flyTo({
  //     center: [coords.longitude, coords.latitude],
  //     zoom: 12,
  //     curve: 1,
  //     pitch: 40,
  //   });
  // } else {
  //   console.error("Could not fly to location!");
  // }
};

const handleRouteFlyTo = (start: GeoPoint, end: GeoPoint) => {
  const mapInstance = Map.getInstance()?.getMap();

  if (!mapInstance) {
    console.error("Map instance is not initialized yet.");
    return;
  }

  if (!start || !end) {
    console.error("Invalid start or end points for route.");
    return;
  }

  // Construct the bounding box using the start and end points
  const bounds = new mapboxgl.LngLatBounds(
    [start.longitude, start.latitude],
    [end.longitude, end.latitude]
  );

  // Extend bounds in case of additional route points
  const routeCoordinates: [number, number][] = [
    [start.longitude, start.latitude],
    [end.longitude, end.latitude],
  ];
  routeCoordinates.forEach((coord) => bounds.extend(coord));

  const center = bounds.getCenter();

  mapInstance.flyTo({
    center: center,
    pitch: 0,
    zoom: 12.5,
    essential: true,
  });
};

export { handleSearchFlyTo, handleRouteFlyTo };
