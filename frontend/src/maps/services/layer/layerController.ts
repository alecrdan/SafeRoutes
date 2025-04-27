import { LayerManager } from "./layerManager";
import { fetchDirections } from "../api-routes";
import GeoPoint from "@/maps/utils/schemas/geo/GeoPoint";
import { MapFeature } from "@/maps/utils/schemas/feature/feature";

class LayerController {
  private mapInstance: mapboxgl.Map;
  private id: string;
  private type: string;
  private start: GeoPoint;
  private end: GeoPoint;

  constructor(
    mapInstance: mapboxgl.Map,
    id: string,
    type: string,
    start: GeoPoint,
    end: GeoPoint
  ) {
    this.mapInstance = mapInstance;
    this.id = id;
    this.type = type;
    this.start = start;
    this.end = end;
  }

  public async constructRoute() : Promise<MapFeature | void> {
    try {
      const geojson = await fetchDirections(this.type, this.start, this.end);

      if (geojson == null) {
        throw Error;
      }

      const route = geojson.geometry.coordinates;

      const mapFeature: MapFeature = {
        id: this.id,
        feature: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        }
      };

      console.log(this.id);

      let coordinates: number[][] | undefined;

      if (mapFeature.feature.geometry.type === "LineString" && !mapFeature != null) {
        coordinates = mapFeature.feature.geometry.coordinates;
        const start: GeoPoint = new GeoPoint(
          coordinates[0][0],
          coordinates[0][1]
        );
        const end: GeoPoint = new GeoPoint(
          coordinates[coordinates.length - 1][0],
          coordinates[coordinates.length - 1][1]
        );

        // TODO: Change the String(this.id) to a user id???
        let layerManager = new LayerManager(this.mapInstance, mapFeature.id);

        // TODO: add an id to this so routes can be distinct
        layerManager.addline(mapFeature, start, end);
        return mapFeature;
      } else {
        throw new Error("Geometry is not of type LineString");
      }
    } catch (error) {
      console.error("Error constructing route:", error);
    }
  }

  public async constructPoint(): Promise<void> {
    try {
      // TODO: Change the String(this.id) to a user id???
      let layerManager = new LayerManager(this.mapInstance, this.id);

      // TODO: add an id to this so routes can be distinct
      layerManager.addWaypoint("search-waypoint", this.start);
    } catch (error) {
      console.error("Error constructing route:", error);
    }
  }
}

export default LayerController;
