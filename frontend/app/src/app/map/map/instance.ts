import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

class Map {
  private mapRef: mapboxgl.Map | null;
  private mapContainerRef: HTMLDivElement | null;

  constructor() {
    this.mapRef = null;
    this.mapContainerRef = null;
  }

  setContainer(container: HTMLDivElement) {
    if (this.mapContainerRef !== container) {
      this.mapContainerRef = container;
      this.initMap();
    }
  }

  private initMap() {
    if (!this.mapContainerRef || this.mapRef) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw";

    // Map
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

  getInstance() {
    return this.mapRef;
  }

  removeMap() {
    if (this.mapRef) {
      this.mapRef.remove();
      this.mapRef = null;
    }
  }
}

export default Map;
