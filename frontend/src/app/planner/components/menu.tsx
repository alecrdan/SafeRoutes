"use client";

import React, { useEffect, useState } from "react";
import GeoPoint from "../../../maps/utils/geo/GeoPoint";
import { Button } from "@headlessui/react";
import { Route } from "../../../maps/utils/route/route";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { initializeRoutes } from "@/maps/controllers/route-controller";

interface LocationData {
  address: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

const Menu: React.FC = () => {
  const [start, setStart] = useState<LocationData | null>(null);
  const [end, setEnd] = useState<LocationData | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);

  const { data: receivedRoutes } = useGetRoutesQuery();

  const handleRetrieve = (res: Location | any, type: "start" | "end") => {
    if (!res.features?.length) {
      console.warn("No features found in response.");
      return;
    }

    const feature = res.features[0];
    if (!feature.properties) return;

    const { properties } = feature;
    const { coordinates } = properties;

    const locationData: LocationData = {
      address: properties.address ?? "",
      fullAddress: properties.full_address ?? "",
      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,
    };

    type === "start" ? setStart(locationData) : setEnd(locationData);
  };

  useEffect(() => {
    if (receivedRoutes && Array.isArray(receivedRoutes)) {
      setRoutes(receivedRoutes);
      console.log(receivedRoutes);
     try{
       initializeRoutes(receivedRoutes);
     } catch (error) {
    console.error("Failed to initialize");
     }
    } else {
      console.error("Invalid data format for routes:", receivedRoutes);
    }
  }, [receivedRoutes]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!start || !end) {
      console.error("Start or End location is missing.");
      return;
    }

    try {
      let startGeoPoint = new GeoPoint(start.latitude, start.longitude);
      let endGeoPoint = new GeoPoint(end.latitude, end.longitude);

      console.log("Start GeoPoint:", startGeoPoint.toString());
      console.log("End GeoPoint:", endGeoPoint.toString());

      // Hardcoded Values to save API tokens
      const one = new GeoPoint(40.758, -73.9855);
      const two = new GeoPoint(40.7033, -74.017);
    } catch (error) {
      console.error("Failed to create route", error);
    }
  };

  return (
    <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[450px]">
        {/* Start Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Start
          </label>
          <div className="mt-2">{/* <SearchBox ... /> */}</div>
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Destination
          </label>
          <div className="mt-2">{/* <SearchBox ... /> */}</div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="flex w-full justify-center rounded-md bg-gray-700 py-1.5 px-3 text-md/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            Route
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Menu;
