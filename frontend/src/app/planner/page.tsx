"use client";

import Navbar from "../components/core/navbar";
import SearchBar from "./components/search-bar";
import MapView from "../../maps/page";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("./components/menu"), { ssr: false });

export const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Planner() {
  return (
    <div>
      <div className="menu absolute top-24 left-5 z-10">
        <Menu />
      </div>
      <div className="searchbar absolute top-71 left-5 z-10">
        <SearchBar />
      </div>
      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
