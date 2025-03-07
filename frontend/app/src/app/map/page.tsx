"use client";

import { useEffect, useRef, useState } from "react";
import Map from "./map-instance/create-map-instance";
import MapRoute from "./features/createRoute";

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const map = useRef(new Map()).current;

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error("Error: Map container is null.");
      return;
    }

    console.log("Initializing map container...");
    map.setContainer(mapContainerRef.current);

    const instance = map.getInstance();
    if (!instance) {
      console.error("Error: Map instance failed to initialize.");
      return;
    }

    setMapInstance(instance);

    return () => {
      if (instance) {
        console.log("Cleaning up map instance...");
        instance.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance) return;

    const fetchRoute = async () => {
      const coords: [number, number, number, number] = [
        -74.006,
        40.7128, // Start: Lower Manhattan
        -73.9352,
        40.7306, // End: Brooklyn Bridge Park
      ];

      const mapRoute = new MapRoute(mapInstance, "cycling", coords);
      const updatedMap = await mapRoute.getRoute();
      setMapInstance(updatedMap);
    };

    fetchRoute();
  }, [mapInstance]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh", background: "#ddd" }}
    ></div>
  );
};

export default MapComponent;
