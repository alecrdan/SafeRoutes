import { getDirections } from "../services/api-routes";
import GeoPoint from "../utils/geo/GeoPoint";
import mapboxgl from "mapbox-gl";
import { v4 as uuidv4 } from "uuid";

class MapRoute {
  private type: string;
  private start: GeoPoint;
  private end: GeoPoint;
  private mapInstance: mapboxgl.Map;
  private sourceId: string;

  constructor(
    mapInstance?: mapboxgl.Map,
    type?: string,
    start?: GeoPoint,
    end?: GeoPoint
  ) {
    this.mapInstance = mapInstance!;
    this.type = type!;
    this.start = start!;
    this.end = end!;
    this.sourceId = "alecrdan";

    if (!this.mapInstance.getSource(this.sourceId)) {
      this.mapInstance.addSource(this.sourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Add layers for rendering points and routes
      this.addLayers();
    }

    // Add a slight delay to endure layers are added
    setTimeout(() => this.addLayers(), 50);
  }

  // ** Adds Mapbox Layers (if they don’t already exist) **
  private addLayers(): void {
    if (!this.mapInstance.getLayer("route-layer")) {
      this.mapInstance.addLayer({
        id: "route-layer",
        type: "line",
        source: this.sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#2563EB",
          "line-width": 8,
          "line-opacity": 0.9,
          "line-emissive-strength": 1.0,
        },
      });
    }

    if (!this.mapInstance.getLayer("point-layer")) {
      this.mapInstance.addLayer({
        id: "point-layer",
        type: "circle",
        source: this.sourceId,
        paint: {
          "circle-radius": 10,
          "circle-color": [
            "match",
            ["get", "type"],
            "start",
            "#34D399", // Green for start
            "end",
            "#F87171", // Red for end
            "#FFD700", // Default color (yellow)
          ],
          "circle-emissive-strength": 1.0,
        },
      });
    }
  }

  // ** Adds a feature dynamically with a unique ID **
  addFeature(feature: GeoJSON.Feature): void {
    const source = this.mapInstance.getSource(
      this.sourceId
    ) as mapboxgl.GeoJSONSource;
    if (!source) return;

    const data = (source._data as GeoJSON.FeatureCollection) || {
      type: "FeatureCollection",
      features: [],
    };

    feature.id = uuidv4();
    data.features.push(feature);

    source.setData(data);

    // Repaint layer after each added feature
    this.mapInstance.triggerRepaint();
  }

  // ** Fetches route directions and adds to the map **
  private async fetchDirections(): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> {
    try {
      const response = await fetch(
        getDirections("cycling", this.start, this.end, mapboxgl.accessToken)
      );

      if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);

      const data = await response.json();
      if (!data.routes || data.routes.length === 0)
        throw new Error("No routes found.");

      return {
        type: "Feature",
        properties: { type: "route" },
        geometry: {
          type: "LineString",
          coordinates: data.routes[0].geometry.coordinates,
        },
      };
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  }

  // ** Constructs a start or end point for a route **
  constructPoint(
    route_id: number,
    type: "start" | "end",
    coords: GeoPoint
  ): void {
    const feature: GeoJSON.Feature = {
      type: "Feature",
      id: `${type}-${route_id}-${uuidv4()}`, // Unique ID
      properties: { type },
      geometry: { type: "Point", coordinates: coords.toArray() },
    };
    this.addFeature(feature);
  }

  // ** Constructs a generic marker for locations **
  constructMarker(type: string, coords: GeoPoint): void {
    const feature: GeoJSON.Feature = {
      type: "Feature",
      id: `${type}-marker-${uuidv4()}`, // Unique ID
      properties: { type },
      geometry: { type: "Point", coordinates: coords.toArray() },
    };
    this.addFeature(feature);
  }

  // ** Constructs a route and adds start/end points **
  public async constructRoute(route_id: number): Promise<void> {
    try {
      // Wait for directions
      const geojson = await this.fetchDirections();
      // Ensure geojson is there
      if (!geojson) return;

      geojson.id = `route-${route_id}-${uuidv4()}`;
      this.addFeature(geojson);

      const coordinates = geojson.geometry.coordinates;
      this.constructPoint(
        route_id,
        "start",
        new GeoPoint(coordinates[0][0], coordinates[0][1])
      );
      this.constructPoint(
        route_id,
        "end",
        new GeoPoint(
          coordinates[coordinates.length - 1][0],
          coordinates[coordinates.length - 1][1]
        )
      );

      console.log("Route added successfully", geojson);
    } catch (error) {
      console.error("Error constructing route:", error);
    }
  }
}

export default MapRoute;
