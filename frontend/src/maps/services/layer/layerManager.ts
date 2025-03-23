import GeoPoint from "@/maps/utils/geo/GeoPoint";

export class LayerManager {
  private mapInstance: mapboxgl.Map;
  private id: string;
  // TODO: Add global var for route, line, poly ???

  constructor(mapInstance: mapboxgl.Map, id: string) {
    this.mapInstance = mapInstance;
    this.id = id;

    // Intialize Layers
    // Point Layer
    if (!this.mapInstance.getSource(`line-${this.id}`)) {
      this.mapInstance.addSource(`line-${this.id}`, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      this.mapInstance.addLayer({
        id: `line-${id}`,
        type: "line",
        source: `line-${this.id}`,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 7,
          "line-opacity": 0.95,
          "line-emissive-strength": 1.0,
        },
      });
    }
    // Line Layer
    if (!this.mapInstance.getSource(`point-${this.id}`)) {
      this.mapInstance.addSource(`point-${this.id}`, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      this.mapInstance.addLayer({
        id: `point-${this.id}`,
        type: "circle",
        source: `point-${this.id}`,
        paint: {
          "circle-radius": 10,
          "circle-color": [
            "match",
            ["get", "type"],
            "start",
            "#34D399", // Green for start
            "end",
            "#F87171", // Red for end
            "search-waypoint",
            "#193cb8",
            "#ffb86a", // This defines the turns change color
          ],
          "circle-emissive-strength": 1.0,
        },
      });
    }
  }

  addWaypoint(type: string, point: GeoPoint) {
    const pointSource = this.mapInstance.getSource(
      `point-${this.id}`
    ) as mapboxgl.GeoJSONSource;

    const waypoint: GeoJSON.Feature = {
      type: "Feature",
      id: `${type}-${this.id}`,
      properties: { type },
      geometry: { type: "Point", coordinates: point.toArray() },
    };

    pointSource.setData({
      type: "FeatureCollection",
      features: [waypoint],
    });

    this.mapInstance.triggerRepaint();
  }

  addRoutePoint(type: string, point: GeoPoint) {
    const feature: GeoJSON.Feature = {
      type: "Feature",
      id: `${type}-${this.id}`,
      properties: { type },
      geometry: { type: "Point", coordinates: point.toArray() },
    };
    return feature;
  }

  addline(data: GeoJSON.Feature, startPoint: GeoPoint, endPoint: GeoPoint) {
    // Line source
    const lineSource = this.mapInstance.getSource(
      `line-${this.id}`
    ) as mapboxgl.GeoJSONSource;
    const pointSource = this.mapInstance.getSource(
      `point-${this.id}`
    ) as mapboxgl.GeoJSONSource;

    // Create start and end point features
    const startFeature = this.addRoutePoint("start", startPoint);
    const endFeature = this.addRoutePoint("end", endPoint);

    // Set Line
    lineSource.setData({
      type: "FeatureCollection",
      features: [data],
    });
    // Set Points as a single FeatureCollection
    pointSource.setData({
      type: "FeatureCollection",
      features: [startFeature, endFeature],
    });

    this.mapInstance.triggerRepaint();
  }
}
