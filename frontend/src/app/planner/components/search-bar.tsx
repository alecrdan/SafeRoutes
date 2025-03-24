"use client";

import React, { useState } from "react";
import GeoPoint from "../../../maps/utils/geo/GeoPoint";
import { handleSearchFlyTo } from "../../../maps/features/fly-to";
import { Button } from "@headlessui/react";
import { token } from "../../planner/page";
import { SearchBox } from "@mapbox/search-js-react";

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

    const geoPoint = new GeoPoint(longitude, latitude);
    console.log(geoPoint);
    setCoords(geoPoint);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      handleSearchFlyTo(coords);
    } catch (error) {
      console.error("Error in handleFlyTo:", JSON.stringify(error));
    }
  };

  return (
    <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[450px]">
        {/* Start Location Input */}

        <div className="">
          <SearchBox
            accessToken={String(token)}
            onRetrieve={handleRetrieve}
          />
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
