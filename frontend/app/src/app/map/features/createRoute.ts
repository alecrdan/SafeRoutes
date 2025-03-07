import mapboxgl from "mapbox-gl";

type Coordinates = [number, number, number, number];

class MapRoute {
  private type: string;
  private coords: Coordinates;
  private instance: mapboxgl.Map;

  constructor(instance: mapboxgl.Map, type: string, coords: Coordinates) {
    this.instance = instance;
    this.type = type;
    this.coords = coords;
  }

  static getInstance(): typeof mapboxgl {
    if (!mapboxgl.accessToken) {
      throw new Error(
        "MapboxGL is not initialized. Set accessToken before using."
      );
    }
    return mapboxgl;
  }

  private async fetchRoute(coords: Coordinates): Promise<any | null> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${this.type}/${coords[0]},${coords[1]};${coords[2]},${coords[3]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  }

  private buildRoute(routeData: any | null): mapboxgl.Map {
    if (!routeData || !routeData.routes || routeData.routes.length === 0) {
      console.error("Error: No route data provided.");
      return this.instance;
    }

    const route = routeData.routes[0].geometry.coordinates;

    const geojson: any = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };

    const existingSource = this.instance.getSource("route");
    if (existingSource) {
      console.log("Updating existing route layer.");
      (existingSource as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      this.instance.addSource("route", {
        type: "geojson",
        data: geojson,
      });

      this.instance.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }

    return this.instance;
  }

  async getRoute(): Promise<mapboxgl.Map> {
    const routeData = await this.fetchRoute(this.coords);
    return this.buildRoute(routeData);
  }
}

export default MapRoute;
