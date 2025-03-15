import MapRoute from "../features/create-route";
import Map from "../map/map-instance";
import GeoPoint from "../utils/geo/GeoPoint";

const mapInstance = Map.getInstance().getMap();

const handleRoute = (start: GeoPoint, end: GeoPoint) => {
  if (!mapInstance) {
    console.error("Map instance is not initialized.");
    return;
  }

  const route = new MapRoute(mapInstance, "cycling", start, end);
  route.constructRoute();
  route.constructPoint("start", start);
  route.constructPoint("end", end);
};

export default handleRoute;
