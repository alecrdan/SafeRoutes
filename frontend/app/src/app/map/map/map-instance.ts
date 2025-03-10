import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

class Map {
  private static instance: Map | null = null;
  private mapRef: mapboxgl.Map | null;
  private mapContainerRef: HTMLDivElement | null;

  private constructor() {
    this.mapRef = null;
    this.mapContainerRef = null;
  }

  /** Get the Singleton Instance of Map */
  public static getInstance(): Map {
    if (!Map.instance) {
      Map.instance = new Map();
    }
    return Map.instance;
  }

  /** Set the container and initialize the Map */
  public setContainer(container: HTMLDivElement) {
    if (this.mapContainerRef !== container) {
      this.mapContainerRef = container;
      this.initMap();
    }
  }

  /** Initialize the Mapbox Map */
  private initMap() {
    if (!this.mapContainerRef || this.mapRef) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw";

    this.mapRef = new mapboxgl.Map({
      container: this.mapContainerRef,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.006, 40.7128],
      zoom: 12,
      projection: "globe",
    });

    this.mapRef.on("style.load", () => {
      this.mapRef?.setFog({});
    });
  }

  /** Return the MapboxGL Instance */
  public getMap(): mapboxgl.Map | null {
    return this.mapRef;
  }

  /** Remove and Cleanup Map */
  public removeMap() {
    if (this.mapRef) {
      this.mapRef.remove();
      this.mapRef = null;
    }
  }
}

export default Map;
