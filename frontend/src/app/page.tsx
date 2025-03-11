"use client";

import MapView from "./map/page";
import dynamic from "next/dynamic";
import SearchBar from "./components/search-bar";
import Navbar from "./components/navbar";

const Menu = dynamic(() => import("@/app/components/menu"), { ssr: false });

export const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  return (
    <div>
      <div className="navbar absolute w-screen z-10">
        <Navbar />
      </div>
      <div className="menu absolute top-26 left-5 z-10">
        <Menu />
      </div>
      <div className="searchbar absolute top-73 left-5 z-10">
        <SearchBar />
      </div>
      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
