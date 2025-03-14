import GeoPoint from "../../utils/geo/GeoPoint";
import mapboxgl from "mapbox-gl";

class MapRoute {
  private type: string;
  private start: GeoPoint;
  private end: GeoPoint;
  private mapInstance: mapboxgl.Map;

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
  }

  static getmapInstance(): typeof mapboxgl {
    if (!mapboxgl.accessToken) {
      throw new Error(
        "MapboxGL is not initialized. Set accessToken before using."
      );
    }
    return mapboxgl;
  }

  private async fetchDirections(): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${this.type}/${this.start.longitude},${this.start.latitude};${this.end.longitude},${this.end.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
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
          geometry: { type: "Point", coordinates: coords.toArray() },
        },
      ],
    };

    if (!this.mapInstance.isStyleLoaded()) {
      console.warn(`Waiting for map style before adding ${type} point...`);
      this.mapInstance.once("styledata", () => {
        this.addPointToMap(this.mapInstance, pointSourceId, point, type);
      });
    } else {
      this.addPointToMap(this.mapInstance, pointSourceId, point, type);
    }
  }

  constructMarker(
    mapInstance: mapboxgl.Map,
    type: string,
    coords: GeoPoint
  ): void {
    const pointSourceId = `${type}-point`;

    const point: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: coords.toArray() },
        },
      ],
    };

    if (!mapInstance.isStyleLoaded()) {
      console.warn(`Waiting for map style before adding ${type} point...`);
      this.mapInstance.once("styledata", () => {
        this.addPointToMap(mapInstance, pointSourceId, point, type);
      });
    } else {
      this.addPointToMap(mapInstance, pointSourceId, point, type);
    }
  }

  private addPointToMap(
    mapInstance: mapboxgl.Map,
    sourceId: string,
    point: GeoJSON.FeatureCollection<GeoJSON.Point>,
    type: string
  ): void {
    const existingSource = mapInstance.getSource(sourceId);

    if (existingSource) {
      (existingSource as mapboxgl.GeoJSONSource).setData(point);
    } else {
      mapInstance.addSource(sourceId, { type: "geojson", data: point });

      mapInstance.addLayer({
        id: `${type}-marker`,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 10,
          "circle-color": type === "start" ? "#34D399" : "#F87171",
          "circle-emissive-strength": 1.0,
        },
      });
    }
  }

  constructRoute(): void {
    this.fetchDirections()
      .then((geojson) => {
        if (!geojson) return;

        const existingSource = this.mapInstance.getSource("route");
        if (existingSource) {
          (existingSource as mapboxgl.GeoJSONSource).setData(geojson);
        } else {
          this.mapInstance.addSource("route", {
            type: "geojson",
            data: geojson,
          });

          this.mapInstance.addLayer({
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
              "line-opacity": 0.9,
              "line-emissive-strength": 1.0,
            },
          });
        }
      })
      .catch((error) => console.error("Error constructing route:", error));
  }
}

export default MapRoute;
