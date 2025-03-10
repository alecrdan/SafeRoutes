"use client";

import React, { useState } from "react";
import GeoPoint from "../utils/geo/GeoPoint";
import handleRoute from "../controllers/route-controller";
import { handleRouteFlyTo } from "../map/features/fly-to";

interface LocationData {
  address: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

const Menu: React.FC = () => {
  const [start, setStart] = useState<LocationData | null>(null);
  const [end, setEnd] = useState<LocationData | null>(null);

  const handleRetrieve = (res: Location | any, type: "start" | "end") => {
    if (!res.features?.length) {
      console.warn("No features found in response.");
      return;
    }

    const feature = res.features[0];
    if (!feature.properties) return;

    const { properties } = feature;
    const { context, coordinates } = properties;

    const locationData: LocationData = {
      address: properties.address ?? "",
      fullAddress: properties.full_address ?? "",
      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,
    };

    type === "start" ? setStart(locationData) : setEnd(locationData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!start || !end) {
    //   console.error("Start or End location is missing.");
    //   return;
    // }

    try {
      // let startGeoPoint = new GeoPoint(start.longitude, start.latitude);
      // let endGeoPoint = new GeoPoint(end.longitude, end.latitude);

      // console.log("Start GeoPoint:", startGeoPoint.toString());
      // console.log("End GeoPoint:", endGeoPoint.toString());

      // const distance = startGeoPoint.distanceTo(endGeoPoint);

      // Hardcoded Values to save API tokens
      const one = new GeoPoint(-73.9855, 40.758);
      const two = new GeoPoint(-74.017, 40.7033);

      handleRoute(one, two);
      handleRouteFlyTo(one, two);
      // console.log(`Distance: ${distance.toFixed(2)} km`);
    } catch (error) {
      console.error("Failed to create route");
    }
  };

  return (
    <div className="menu absolute top-5 left-5 z-10 bg-black/85 backdrop-blur-md rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[450px]">
        {/* Start Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Start
          </label>
          <div className="mt-2">
            {/* <SearchBox
              accessToken="pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw"
              options={{ proximity: { lng: -122.431297, lat: 37.773972 } }}
              value={start?.fullAddress || ""}
              onChange={(value) =>
                setStart({ ...start, fullAddress: value } as LocationData)
              }
              onRetrieve={(res: any) => handleRetrieve(res, "start")}
            /> */}
          </div>
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Destination
          </label>
          <div className="mt-2">
            {/* <SearchBox
              accessToken="pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw"
              options={{ proximity: { lng: -122.431297, lat: 37.773972 } }}
              value={end?.fullAddress || ""}
              onChange={(value) =>
                setEnd({ ...end, fullAddress: value } as LocationData)
              }
              onRetrieve={(res: any) => handleRetrieve(res, "end")}
            /> */}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-black shadow-sm hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
          >
            Route
          </button>
        </div>
      </form>
    </div>
  );
};

export default Menu;
