"use client";

import React, { useState, useEffect } from "react";
import MapView from "./map/page";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("@/app/components/menu"), { ssr: false });

export default function Home() {
  return (
    <div>
      <div className="menu">
        <Menu />
      </div>
      {/* Map */}
      <div className="map-container">
        <MapView />
      </div>
    </div>
  );
}
