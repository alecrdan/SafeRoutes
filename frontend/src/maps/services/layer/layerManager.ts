import GeoPoint from "@/maps/utils/schemas/geo/GeoPoint";
import {
  addFeature,
  removeFeature,
} from "../../../redux/features/selectedRouteSlice";
import { getDispatch } from "@/redux/context/dispatchService";
import { store } from "@/redux/store";

export class LayerManager {
  private mapInstance: mapboxgl.Map;
  private id: string;
  private dispatch = getDispatch();

  private hoveredLineFeatureId: string | null = null;
  private hoveredPointFeatureId: string | null = null;

  private selectedFeatures: { id: string; source: string }[] = [];
  private updatedRoutes: any;
  private focusedRoutes: any;

  constructor(mapInstance: mapboxgl.Map, id: string) {
    this.mapInstance = mapInstance;
    this.id = id;

    store.subscribe(() => {
      this.updatedRoutes = store.getState().selectedRoutes;
    });

    store.subscribe(() => {
      this.focusedRoutes = store.getState().focusedRoutes;
    });

    this.initializeLayers();
    this.attachLineEvents();
    this.attachPointEvents();
  }

  private initializeLayers() {
    // Line Layer
    if (!this.mapInstance.getSource(`line-${this.id}`)) {
      this.mapInstance.addSource(`line-${this.id}`, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        generateId: true,
      });

      this.mapInstance.addLayer({
        id: `line-${this.id}`,
        type: "line",
        source: `line-${this.id}`,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            10,
            7,
          ],
          "line-opacity": 0.95,
          "line-emissive-strength": 1.0,
        },
      });
    }

    // Point Layer
    if (!this.mapInstance.getSource(`point-${this.id}`)) {
      this.mapInstance.addSource(`point-${this.id}`, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      this.mapInstance.addLayer({
        id: `point-${this.id}`,
        type: "circle",
        source: `point-${this.id}`,
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            14,
            10,
          ],
          "circle-color": [
            "match",
            ["get", "type"],
            "start",
            "#34D399",
            "end",
            "#F87171",
            "search-waypoint",
            "#193cb8",
            "#ffb86a",
          ],
          "circle-emissive-strength": 1.0,
        },
      });
    }
  }

  private attachLineEvents() {
    this.mapInstance.on("click", `line-${this.id}`, this.handleLineClick);
    this.mapInstance.on("mouseenter", `line-${this.id}`, this.handleLineEnter);
    this.mapInstance.on("mouseleave", `line-${this.id}`, this.handleLineLeave);

    this.mapInstance.setPaintProperty(`line-${this.id}`, "line-color", [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      "#f59e0b", // orange if selected
      ["boolean", ["feature-state", "hover"], false],
      "#2563eb", // blue if hover
      "#3887be", // default
    ]);
  }

  private attachPointEvents() {
    this.mapInstance.on("mouseenter", `point-${this.id}`, () => {
      this.mapInstance.getCanvas().style.cursor = "pointer";
    });

    this.mapInstance.on("mouseleave", `point-${this.id}`, () => {
      this.mapInstance.getCanvas().style.cursor = "";
    });
  }

  private handleLineClick = (e: mapboxgl.MapMouseEvent) => {
    const featureId = e.features?.[0]?.id;
    if (featureId != undefined && featureId != null) {
      const idStr = featureId as string;
      const source = `line-${this.id}`;

      const alreadySelected = this.selectedFeatures.some(
        (f) => f.id === idStr && f.source === source
      );

      if (!alreadySelected) {
        this.selectedFeatures.push({ id: idStr, source });
        this.mapInstance.setFeatureState(
          { source, id: idStr },
          { selected: true }
        );
        this.dispatch(
          addFeature({ routeId: `line-${this.id}`, featureId: idStr })
        );
      } else {
        this.selectedFeatures = this.selectedFeatures.filter(
          (f) => f.id !== idStr || f.source !== source
        );
        this.mapInstance.setFeatureState(
          { source, id: idStr },
          { selected: false }
        );
        this.dispatch(
          removeFeature({ routeId: `line-${this.id}`, featureId: idStr })
        );
      }

      console.log("Updated routes:", this.updatedRoutes);
    }
  };

  private handleLineEnter = (e: mapboxgl.MapMouseEvent) => {
    this.mapInstance.getCanvas().style.cursor = "pointer";
    const featureId = e.features?.[0]?.id;
    if (featureId != undefined && featureId != null) {
      this.hoveredLineFeatureId = featureId as string;
      this.mapInstance.setFeatureState(
        { source: `line-${this.id}`, id: this.hoveredLineFeatureId },
        { hover: true }
      );
    }
  };

  private handleLineLeave = () => {
    this.mapInstance.getCanvas().style.cursor = "";
    if (this.hoveredLineFeatureId) {
      this.mapInstance.setFeatureState(
        { source: `line-${this.id}`, id: this.hoveredLineFeatureId },
        { hover: false }
      );
      this.hoveredLineFeatureId = null;
    }
  };

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

  addRoutePoint(type: string, point: GeoPoint): GeoJSON.Feature {
    return {
      type: "Feature",
      id: `${type}-${this.id}`,
      properties: { type },
      geometry: { type: "Point", coordinates: point.toArray() },
    };
  }

  addline(data: GeoJSON.Feature, startPoint: GeoPoint, endPoint: GeoPoint) {
    const lineSource = this.mapInstance.getSource(
      `line-${this.id}`
    ) as mapboxgl.GeoJSONSource;
    const pointSource = this.mapInstance.getSource(
      `point-${this.id}`
    ) as mapboxgl.GeoJSONSource;

    const startFeature = this.addRoutePoint("start", startPoint);
    const endFeature = this.addRoutePoint("end", endPoint);

    lineSource.setData({
      type: "FeatureCollection",
      features: [{ ...data, id: `line-${this.id}` }],
    });

    pointSource.setData({
      type: "FeatureCollection",
      features: [startFeature, endFeature],
    });

    this.mapInstance.triggerRepaint();
  }
}
