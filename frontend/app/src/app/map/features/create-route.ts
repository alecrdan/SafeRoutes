import mapboxgl from "mapbox-gl";
import GeoPoint from "../schemas/map";

class MapRoute {
  private type: string;
  private start: GeoPoint;
  private end: GeoPoint;
  private instance: mapboxgl.Map;

  constructor(
    instance: mapboxgl.Map,
    type: string,
    start: GeoPoint,
    end: GeoPoint
  ) {
    this.instance = instance;
    this.type = type;
    this.start = start;
    this.end = end;
  }

  static getInstance(): typeof mapboxgl {
    if (!mapboxgl.accessToken) {
      throw new Error(
        "MapboxGL is not initialized. Set accessToken before using."
      );
    }
    return mapboxgl;
  }

  private async fetchDirections(): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${this.type}/${this.start[0]},${this.start[1]};${this.end[0]},${this.end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0)
        throw new Error("No routes found.");

      return {
        type: "Feature",
        properties: {},
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

  constructPoint(type: "start" | "end", coords: GeoPoint): void {
    const pointSourceId = `${type}-point`;

    const point: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: coords },
        },
      ],
    };

    if (!this.instance.isStyleLoaded()) {
      console.warn(`Waiting for map style before adding ${type} point...`);
      this.instance.once("styledata", () => {
        this.addPointToMap(pointSourceId, point, type);
      });
    } else {
      this.addPointToMap(pointSourceId, point, type);
    }
  }

  private addPointToMap(
    sourceId: string,
    point: GeoJSON.FeatureCollection<GeoJSON.Point>,
    type: string
  ): void {
    const existingSource = this.instance.getSource(sourceId);

    if (existingSource) {
      (existingSource as mapboxgl.GeoJSONSource).setData(point);
    } else {
      this.instance.addSource(sourceId, { type: "geojson", data: point });

      this.instance.addLayer({
        id: `${type}-marker`,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 10,
          "circle-color": type === "start" ? "#34D399" : "#F87171",
        },
      });
    }
  }

  constructRoute(): void {
    this.fetchDirections()
      .then((geojson) => {
        if (!geojson) return;

        const existingSource = this.instance.getSource("route");
        if (existingSource) {
          (existingSource as mapboxgl.GeoJSONSource).setData(geojson);
        } else {
          this.instance.addSource("route", { type: "geojson", data: geojson });

          this.instance.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#2563EB",
              "line-width": 10,
              "line-opacity": 0.8,
            },
          });
        }
      })
      .catch((error) => console.error("Error constructing route:", error));
  }
}

export default MapRoute;
