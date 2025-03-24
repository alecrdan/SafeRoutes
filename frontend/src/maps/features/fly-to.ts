import Map from "../map/map-instance";
import { buildWaypoint } from "../services/layer/layerHub";
import GeoPoint from "../utils/geo/GeoPoint";
import mapboxgl from "mapbox-gl";

const handleSearchFlyTo = (coords: GeoPoint | null) => {
  const mapInstance = Map.getInstance()?.getMap();

  if (!mapInstance) {
    console.error("Map instance is not initialized yet.");
    return;
  }

  if (coords) {
    // Add point
    buildWaypoint(coords);

    // Fly to
    mapInstance.flyTo({
      center: [coords.longitude, coords.latitude],
      zoom: 12,
      curve: 1,
      pitch: 40,
    });
  } else {
    console.error("Could not fly to location!");
  }
};

const handleRouteFlyTo = async (start: GeoPoint, end: GeoPoint) => {
  const mapInstance = await Map.getInstance().getMap();

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

  // Extend bounds in case of additional route points (if any)
  const routeCoordinates: [number, number][] = [
    [start.longitude, start.latitude],
    [end.longitude, end.latitude],
  ];
  routeCoordinates.forEach((coord) => bounds.extend(coord));

  // Fit bounds so the route is centered and visible with padding
  mapInstance.fitBounds(bounds, {
    padding: 100, 
    maxZoom: 15, 
    pitch: 0,
    essential: true,
  });
};

export { handleSearchFlyTo, handleRouteFlyTo };
