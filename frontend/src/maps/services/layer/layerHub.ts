import { Route } from "../../utils/route/route";
import GeoPoint from "../../utils/geo/GeoPoint";
import Map from "../../map/map-instance";
import LayerController from "./layerController";

export const initializeRoutes = async (routes: Route[]) => {
  try {
    // Injected resourse
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
        let newRoute = new LayerController(mapInstance, route.route_id, "cycling", start, end);
        newRoute.constructRoute();
      } catch (error) {
        console.error(`Failed to initialize route ${route.route_id}`, error);
      }
    });
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};
