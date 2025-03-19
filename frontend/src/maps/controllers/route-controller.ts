import { Route } from "../utils/route/route";
import MapRoute from "../features/create-features";
import GeoPoint from "../utils/geo/GeoPoint";
import Map from "../map/map-instance";

export const initializeRoutes = async (routes: Route[]) => {
  try {
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }

    routes.forEach((route: Route, index: number) => {
      const startLat = Number(route.start_latitude);
      const startLng = Number(route.start_longitude);
      const endLat = Number(route.end_latitude);
      const endLng = Number(route.end_longitude);

      const start: GeoPoint = new GeoPoint(startLng, startLat);
      const end: GeoPoint = new GeoPoint(endLng, endLat);

      try {
        let newRoute = new MapRoute(mapInstance, "driving", start, end);
        newRoute.constructRoute(route.route_id);
        console.log("Initailized");
      } catch (error) {
        console.error(`Failed to initialize route ${route.route_id}`, error);
      }
    });
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};

export const removeAllLayers = async () => {
  try {
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }
    if (mapInstance.getLayer("route-layer")) {
      mapInstance.removeLayer("route-layer");
    }
    if (mapInstance.getLayer("point-layer")) {
      mapInstance.removeLayer("point-layer");
    }
  } catch (error) {
    console.error("Error removing layers and source:", error);
  }
};
