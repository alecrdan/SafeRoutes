"use client";

import { useAppSelector } from "@/redux/hooks";
import MapView from "../../maps/page";
import dynamic from "next/dynamic";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { useEffect, useMemo, useState } from "react";
import { Route } from "@/maps/utils/schemas/route/route";
import { initializeRoutes } from "@/maps/services/layer/layerHub";
import RouteDetailsPanel from "./components/route-details-panel";

const MenuWindow = dynamic(() => import("./components/menu"), { ssr: false });
const MainModel = dynamic(() => import("./components/main-model"), {
  ssr: false,
});
const ExportButton = dynamic(() => import("./components/export-button"), {
  ssr: false,
});
const SearchBarWithDropdown = dynamic(
  () => import("./components/search-bar-dropdown"),
  {
    ssr: false,
  }
);

export const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Planner() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: receivedRoutes } = useGetRoutesQuery();
  const [routes, setRoutes] = useState<Route[]>([]);
  const isReady = useMemo(
    () => receivedRoutes && isAuthenticated,
    [receivedRoutes, isAuthenticated]
  );

  useEffect(() => {
    if (isReady && Array.isArray(receivedRoutes)) {
      setRoutes(receivedRoutes);
      try {
        initializeRoutes(receivedRoutes);
      } catch (error) {
        console.error("Failed to initialize");
      }
    } else if (isReady) {
      console.error("Invalid data format for routes:", receivedRoutes);
    }
  }, [isReady]);

  return (
    <div>
      <div className="menu absolute top-50 right-7 z-10">
        <ExportButton />
      </div>
      {/* <div className="menu absolute top-23 left-5 z-10">
        <Menu />
      </div> */}

      <div className="menu absolute top-23 left-7 z-10">
        <MenuWindow />
      </div>
      <div className="menu absolute top-23 right-7 z-10">
        <MainModel />
      </div>
      {/* <div className="menu absolute top-93 left-7 z-10">
        <RouteDetailsPanel
          route={{
            route_id: 0,
            route_name: "",
            distance_km: 0,
            duration_min: 0,
            start_latitude: "",
            start_longitude: "",
            end_latitude: "",
            end_longitude: "",
            safety_rating: 0,
            traffic_conditions: "",
            terrain_type: "",
            accident_risk_score: 0,
            avoid_highways: false,
            avoid_toll_roads: false,
            prefer_bike_paths: false,
            prefer_scenic_routes: false,
            created_at: "2025-04-01T14:23:00Z",
          }}
        />
      </div> */}

      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
