"use client";

import Navbar from "../components/core/navbar";
import MapView from "../../maps/page";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("./components/menu"), { ssr: false });
const SearchBar = dynamic(() => import("./components/search-bar"), { ssr: false });

export const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Planner() {
  return (
    <div>
      <div className="menu absolute top-24 left-5 z-10">
        <Menu />
      </div>
      <div className="searchbar absolute top-93 left-5 z-5">
        <SearchBar />
      </div>
      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
