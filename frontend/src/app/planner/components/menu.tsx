"use client";

import React, { useEffect, useMemo, useState } from "react";
import { token } from "../../planner/page";
import { SearchBox } from "@mapbox/search-js-react";
import GeoPoint from "../../../maps/utils/schemas/geo/GeoPoint";
import { Button } from "@headlessui/react";
import { Route } from "../../../maps/utils/schemas/route/route";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { buildRoute, initializeRoutes } from "@/maps/services/layer/layerHub";

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

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: receivedRoutes } = useGetRoutesQuery();
  const isReady = useMemo(
    () => receivedRoutes && isAuthenticated,
    [receivedRoutes, isAuthenticated]
  );

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

  // TODO: Routes are being requested before being authenticated.
  useEffect(() => {
    if (isReady && Array.isArray(receivedRoutes)) {
      setRoutes(receivedRoutes);
      console.log(receivedRoutes);
      try {
        initializeRoutes(receivedRoutes);
      } catch (error) {
        console.error("Failed to initialize");
      }
    } else if (isReady) {
      console.error("Invalid data format for routes:", receivedRoutes);
    }
  }, [isReady]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!start || !end) {
      console.error("Start or End location is missing.");
      return;
    }

    try {
      let startPoint = new GeoPoint(start.longitude, start.latitude);
      let endPoint = new GeoPoint(end.longitude, end.latitude);

      buildRoute(startPoint, endPoint);
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
          <div className="mt-2">
            <SearchBox
              accessToken={String(token)}
              options={{ proximity: { lng: -122.431297, lat: 37.773972 } }}
              value={start?.fullAddress || ""}
              onChange={(value) =>
                setStart({ ...start, fullAddress: value } as LocationData)
              }
              onRetrieve={(res: any) => handleRetrieve(res, "start")}
            />
          </div>
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Destination
          </label>
          <div className="mt-2">
            <SearchBox
              accessToken={String(token)}
              options={{ proximity: { lng: -122.431297, lat: 37.773972 } }}
              value={end?.fullAddress || ""}
              onChange={(value) =>
                setEnd({ ...end, fullAddress: value } as LocationData)
              }
              onRetrieve={(res: any) => handleRetrieve(res, "end")}
            />
          </div>
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
