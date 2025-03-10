"use client";

import { useEffect, useRef, useState } from "react";
import Map from "./map/instance";
import MapRoute from "./features/create-route";

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const map = useRef(new Map()).current;

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error("Error: Map container is null.");
      return;
    }

    // Initialize map container
    console.log("Initializing map container...");
    map.setContainer(mapContainerRef.current);

    // Get instance of the Map
    const instance = map.getInstance();
    if (!instance) {
      console.error("Error: Map instance failed to initialize.");
      return;
    }

    // Wait for map to fully load before setting state
    instance.on("load", () => {
      console.log("Map style has loaded.");
      setMapInstance(instance);
    });

    return () => {
      if (instance) {
        console.log("Cleaning up map instance...");
        instance.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance) {
      fetchRoute(mapInstance);
    }
  }, [mapInstance]);


  // Create a route
  const fetchRoute = async (instance: mapboxgl.Map) => {
    const start: [number, number] = [-74.006, 40.7128]; // Start: Lower Manhattan
    const end: [number, number] = [-73.9352, 40.7306]; // End: Brooklyn Bridge Park

    const route = new MapRoute(instance, "cycling", start, end);
    route.constructRoute();
    route.constructPoint("start", start);
  };

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh", background: "#ddd" }}
    ></div>
  );
};

export default MapComponent;
