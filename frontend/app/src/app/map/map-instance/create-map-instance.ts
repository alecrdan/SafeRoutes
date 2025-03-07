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
      "pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203eXhkaDRrMGVubzJqb2k2dnZjMDZrNCJ9.izchMyEut0FpFHeCWW86og";

    this.mapRef = new mapboxgl.Map({
      container: this.mapContainerRef,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
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
