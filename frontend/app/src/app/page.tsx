"use client";

import MapView from "./map/page";
import dynamic from "next/dynamic";
import SearchBar from "./components/search-bar";

const Menu = dynamic(() => import("@/app/components/menu"), { ssr: false });

export default function Home() {
  return (
    <div>
      <div className="menu">
        <Menu />
      </div>
      <div className="searchbar">
        <SearchBar />
      </div>
      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
