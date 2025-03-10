"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import GeoPoint from "../utils/geo/GeoPoint";
import { handleSearchFlyTo } from "../map/features/fly-to";

const SearchBar = () => {
  const [coords, setCoords] = useState<GeoPoint | null>(null);

  const handleRetrieve = (res: any) => {
    if (!res.features?.length) {
      console.warn("No features found in response.");
      return;
    }

    const feature = res.features[0];
    if (!feature.geometry || !feature.geometry.coordinates) {
      console.warn("No valid geometry found in feature.");
      return;
    }

    const [longitude, latitude] = feature.geometry.coordinates;

    const geoPoint = new GeoPoint(latitude, longitude);
    setCoords(geoPoint);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Flying to coords:", coords);
      const sdPoint = new GeoPoint(-117.1611, 32.7157);

      handleSearchFlyTo(sdPoint);
    } catch (error) {
      console.error("Error in handleFlyTo:", error);
    }
  };

  const theme = {
    variables: {
      fontFamily: "Avenir, sans-serif",
      unit: "14px",
      padding: "15px",
      boxShadow: "0 0 0 1px silver",
    },
  };

  return (
    <div className="menu absolute top-5 right-5 z-10  bg-black/90 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[450px]">
        {/* Start Location Input */}
        <div className="">
          {/* <SearchBox
            accessToken="pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw"
            onRetrieve={handleRetrieve}
            theme={theme}
          /> */}
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-black shadow-sm hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
