"use client";

import React, { useState } from "react";
import { token } from "../../planner/page";
import { SearchBox } from "@mapbox/search-js-react";
import GeoPoint from "../../../maps/utils/schemas/geo/GeoPoint";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { buildRoute } from "@/maps/services/layer/layerHub";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface LocationData {
  address: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

const MenuWindow: React.FC = () => {
  const [start, setStart] = useState<LocationData | null>(null);
  const [end, setEnd] = useState<LocationData | null>(null);
  const [query, setQuery] = useState("");
  const [showRouteForm, setShowRouteForm] = useState(false); // 👈 Control visibility
  const [routeInProgress, setRouteInProgress] = useState(false); // 👈 Control Route in progress

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
      const startPoint = new GeoPoint(start.longitude, start.latitude);
      const endPoint = new GeoPoint(end.longitude, end.latitude);
      buildRoute(startPoint, endPoint);
      setRouteInProgress(true);
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
      colorBackground: "#0a0a0a",
      colorBackgroundHover: "#1c1c1c",
      colorBackgroundActive: "#2a2a2a",
      colorText: "rgb(255, 255,255);",
      colorPrimary: "rgb(255, 255,255);",
      colorSecondary: "#a1a1aa",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "0.5rem",
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
    <>
      {/* Search bar + PlusIcon - hidden if form is shown */}
      {!showRouteForm && (
        <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-zinc-950 px-2 py-2 backdrop-blur-md shadow-inner shadow-white/10">
          <div className="flex-grow">
            <SearchBox
              accessToken={String(token)}
              theme={theme}
              value={query}
              onChange={(val) => setQuery(val)}
              options={{
                proximity: { lng: -122.431297, lat: 37.773972 },
              }}
            />
          </div>

          <Menu as="div" className="relative">
            <MenuButton className="rounded-md p-2  text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white">
              <PlusIcon className="h-5 w-5" />
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              className="absolute right-0 mt-3 w-40 origin-top-right rounded-xl bg-zinc-950 p-1 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur-xl"
            >
              <MenuItem>
                <button
                  onClick={() => setShowRouteForm(true)} // 👈 Show the route form
                  className="w-full px-3 py-1.5 text-left rounded-md hover:bg-white/10"
                >
                  Create Route
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      )}

      {/* Route form - hidden initially, shown after clicking Create Route */}
      {showRouteForm && (
        <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl relative">
          {/* 👇 X button in top-right corner */}
          <Button
            onClick={() => setShowRouteForm(false)}
            className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>

          <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[400px]">
            {/* Start */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start
              </label>
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

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Destination
              </label>
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

            {/* Submit */}
            <div>
              {!routeInProgress ? (
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-white/5"
                >
                  Route
                </Button>
              ) : (
                <div className="flex row gap-2">
                  <Button
                    type="submit"
                    className="flex w-full justify-center rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-white/5"
                  >
                    Save
                  </Button>
                  <Button
                    type="submit"
                    className="flex w-full justify-center rounded-full bg-red-600/30 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600/20"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default MenuWindow;
