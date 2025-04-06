import { Route } from "../../utils/schemas/route/route";
import GeoPoint from "../../utils/schemas/geo/GeoPoint";
import Map from "../../map/map-instance";
import LayerController from "./layerController";
import { v4 as uuidv4 } from "uuid";
import { handleRouteFlyTo } from "@/maps/features/fly-to";

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
        let newRoute = new LayerController(
          mapInstance,
          route.route_id.toString(),
          "cycling", // TODO: Make this get whatever route is in the database
          start,
          end
        );
        newRoute.constructRoute();
      } catch (error) {
        console.error(`Failed to initialize route ${route.route_id}`, error);
      }
    });
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};

export const buildRoute = async (startPoint: GeoPoint, endPoint: GeoPoint) => {
  try {
    // Injected resourse
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }
    try {
      const uniqueRouteId = "search-route";
      let newRoute = new LayerController(
        mapInstance,
        uniqueRouteId,
        "cycling",
        startPoint,
        endPoint
      );
      newRoute.constructRoute();
      handleRouteFlyTo(startPoint, endPoint);
    } catch (error) {
      console.error(`Failed to build search route: `, error);
    }
  } catch (error) {
    console.error("Error building routes:", error);
  }
};

export const buildWaypoint = async (point: GeoPoint) => {
  try {
    // Injected resourse
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }
    try {
      const uniqueRouteId = "search-waypoint";
      let newRoute = new LayerController(
        mapInstance,
        uniqueRouteId,
        "cycling", // TODO: do not need this
        point,
        new GeoPoint(0, 0) // TODO: do not need this. filler geopoint
      );
      newRoute.constructPoint();
    } catch (error) {
      console.error(`Failed to build search route: `, error);
    }
  } catch (error) {
    console.error("Error building routes:", error);
  }
};
