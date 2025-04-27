import { Route } from "../../utils/schemas/route/route";
import GeoPoint from "../../utils/schemas/geo/GeoPoint";
import Map from "../../map/map-instance";
import LayerController from "./layerController";
import { v4 as uuidv4 } from "uuid";
import { handleRouteFlyTo } from "@/maps/features/fly-to";
import { MapFeature } from "@/maps/utils/schemas/feature/feature";
import { selectAllRoutes } from "@/redux/features/routes/featureSlice";
import { store } from "@/redux/store";

/* 
Responsible for initializing routes on the map from the database.
<param name="routes">An array of Route objects to be initialized on the map.</param>
<returns>Returns a promise that resolves when the routes are initialized.</returns>
*/
export const initializeRoutes = async (routes: Route[]) => {
  try {
    // Injected resourse
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }

    routes.forEach(async (route: Route, index: number) => {
      const startLat = Number(route.start_latitude);
      const startLng = Number(route.start_longitude);
      const endLat = Number(route.end_latitude);
      const endLng = Number(route.end_longitude);

      const start: GeoPoint = new GeoPoint(startLng, startLat);
      const end: GeoPoint = new GeoPoint(endLng, endLat);

      try {
        let newRoute = new LayerController(
          mapInstance,
          route.feature_id,
          route.transport_type,
          start,
          end
        );

        // Construct the route and add it to the map
        const mapFeature = await newRoute.constructRoute();

        // Show the most recent route saved in the database
        if (mapFeature && index == routes.length - 1) {
          focusFeature(mapFeature.id);
        }
      } catch (error) {
        console.error(`Failed to initialize route ${route.route_id}`, error);
      }
    });
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
};

/* 
Responsible for building a temp route on the map.
<param name="startPoint">The starting point of the route.</param>
<param name="endPoint">The ending point of the route.</param>
<returns>Returns a promise that resolves to the GeoJSON of the route.</returns>
*/
export const buildRoute = async (startPoint: GeoPoint, endPoint: GeoPoint) => {
  try {
    // Injected resourse
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }
    try {
      let newRoute = new LayerController(
        mapInstance,
        uuidv4(),
        "driving",
        startPoint,
        endPoint
      );
      const routeMapFeature = await newRoute.constructRoute();
      handleRouteFlyTo(startPoint, endPoint);

      if (routeMapFeature) {
        focusFeature(routeMapFeature.id);
      }

      return routeMapFeature;
    } catch (error) {
      console.error(`Failed to build search route: `, error);
    }
  } catch (error) {
    console.error("Error building routes:", error);
  }
};

/* 
Builds a waypoint on the map.
<param name="point">The point to be added as a waypoint.</param>
<returns>Returns a promise that resolves when the waypoint is built.</returns>
*/
export const buildWaypoint = async (point: GeoPoint) => {
  try {
    // Injected resourse
    const mapInstance = await Map.getInstance().getMap();
    if (!mapInstance) {
      console.error("Map was not initialized.");
      return;
    }
    try {
      let newRoute = new LayerController(
        mapInstance,
        uuidv4(),
        "driving",
        point,
        new GeoPoint(0, 0) // do not need this. filler geopoint
      );
      newRoute.constructPoint();
    } catch (error) {
      console.error(`Failed to build search route: `, error);
    }
  } catch (error) {
    console.error("Error building routes:", error);
  }
};

export async function focusFeature(featureId: string) {
  const mapInstance = await Map.getInstance().getMap();
  if (!mapInstance) return;

  const allFeatures: MapFeature[] = selectAllRoutes(store.getState());

  // hide all
  allFeatures.forEach((f) => {
    mapInstance.setLayoutProperty(`line-${f.id}`, "visibility", "none");
    mapInstance.setLayoutProperty(`point-${f.id}`, "visibility", "none");
  });

  // then show just this one
  mapInstance.setLayoutProperty(`line-${featureId}`, "visibility", "visible");
  mapInstance.setLayoutProperty(`point-${featureId}`, "visibility", "visible");
}
