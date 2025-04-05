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

  const handleRetrieve = (res: any, type: "start" | "end") => {
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

  const theme = {
    variables: {
      fontFamily: "Avenir, sans-serif",
      fontWeight: "500",
      fontWeightSemibold: "600",
      fontWeightBold: "700",

      colorBackground: "#0a0a0a", // matches bg-zinc-950
      colorBackgroundHover: "#1c1c1c", // subtle hover like bg-white/5
      colorBackgroundActive: "#2a2a2a", // active state
      colorText: "#ffffff", // white text
      colorPrimary: "#ffffff", // highlight with white accents
      colorSecondary: "#a1a1aa", // matches text-white/50

      border: "1px solid rgba(255, 255, 255, 0.1)", // subtle border like Tailwind ring
      borderRadius: "0.5rem", // similar to rounded-md

      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)",

      unit: "14px",
      padding: "0.5em",
      spacing: "0.5em",

      curve: "ease-in-out",
      duration: "150ms",

      lineHeight: "1.5",
    },
  };

  return (
    <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[400px]">
        {/* Start Location Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Start
          </label>
          <div className="">
            <SearchBox
              theme={theme}
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
          <label className="block text-sm font-medium text-white mb-1">
            Destination
          </label>
          <div className="">
            <SearchBox
              theme={theme}
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
            className="flex w-full justify-center rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-white/5"
          >
            Route
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Menu;
