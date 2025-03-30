import { token } from "../../app/planner/page";
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

  // Get location

  /** Initialize the Mapbox Map */
  private initMap() {
    if (!this.mapContainerRef || this.mapRef) return;

    mapboxgl.accessToken = token;

    const currentHour = new Date().getHours();
    let lightPreset: "dawn" | "day" | "dusk" | "night";
    if (currentHour >= 5 && currentHour < 8) lightPreset = "dawn";
    else if (currentHour >= 8 && currentHour < 18) lightPreset = "day";
    else if (currentHour >= 18 && currentHour < 21) lightPreset = "dusk";
    else lightPreset = "night";

    const defaultCenter: [number, number] = [-122.4194, 37.7749]; // fallback

    const createMap = (center: [number, number]) => {
      this.mapRef = new mapboxgl.Map({
        container: this.mapContainerRef!,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom: 10,
        projection: "globe",
      });

      this.mapRef.on("style.load", () => {
        this.mapRef?.setFog({});
        this.mapRef?.setConfigProperty("basemap", "lightPreset", lightPreset);
      });
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          createMap([longitude, latitude]);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          createMap(defaultCenter);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      createMap(defaultCenter);
    }
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
