"use client";

import { useAppSelector } from "@/redux/hooks";
import MapView from "../../maps/page";
import dynamic from "next/dynamic";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { useEffect, useMemo, useState } from "react";
import { Route } from "@/maps/utils/schemas/route/route";
import { initializeRoutes } from "@/maps/services/layer/layerHub";

const Menu = dynamic(() => import("./components/menu"), { ssr: false });
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
        <SearchBarWithDropdown />
      </div>
      <div className="menu absolute top-23 right-7 z-10">
        <MainModel />
      </div>

      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
function setRoutes(receivedRoutes: Route[]) {
  throw new Error("Function not implemented.");
}
