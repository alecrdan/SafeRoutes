"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import GeoPoint from "../utils/geo/GeoPoint";
import { handleSearchFlyTo } from "../map/features/fly-to";
import { token } from "../page";
import { Button } from "@headlessui/react";

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
    <div className="menu z-10 bg-black/75 backdrop-blur-2xl rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[450px]">
        {/* Start Location Input */}
        <div className="">
          {/* <SearchBox
            // accessToken={token}
            onRetrieve={handleRetrieve}
            theme={theme}
          /> */}
        </div>
        <Button
          type="submit"
          className="flex w-full justify-center rounded-md bg-gray-700 py-1.5 px-3 text-md/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
