"use client";

import { useEffect, useRef, useState } from "react";
import Map from "./map/map-instance";
import RouteController from "../controllers/route-controller";

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error("Error: Map container is null.");
      return;
    }

    console.log("Initializing map...");
    const mapInstance = Map.getInstance(); // Get the singleton instance
    mapInstance.setContainer(mapContainerRef.current);

    const mapboxMap = mapInstance.getMap();
    if (mapboxMap) {
      setMapInstance(mapboxMap);
    }

    return () => {
      console.log("Cleaning up map instance...");
      mapInstance.removeMap();
    };
  }, []);

  useEffect(() => {
    if (mapInstance) {
      // new RouteController().handleRoute(start, end);
    }
  }, [mapInstance]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh", background: "#ddd" }}
    ></div>
  );
};

export default MapComponent;
