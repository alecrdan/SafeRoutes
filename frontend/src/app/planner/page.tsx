"use client";

import MapView from "../../maps/page";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("./components/menu"), { ssr: false });
const MainModel = dynamic(() => import("../components/core/mainModel"), {
  ssr: false,
});
const ExportButton = dynamic(() => import("./components/export-button"), {
  ssr: false,
});

export const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Planner() {
  return (
    <div>
      <div className="menu absolute top-23 right-5 z-10">
        <ExportButton />
      </div>
      <div className="menu absolute top-23 left-5 z-10">
        <Menu />
      </div>
      <div className="menu absolute top-92 left-5 z-10">
        <MainModel />
      </div>
      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
