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
import { Feature, GeoJsonProperties, LineString } from "geojson";
import { useSaveRouteMutation } from "@/redux/features/routesApiSlice";
import { Route } from "@/maps/utils/schemas/route/route";

interface LocationData {
  address: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

const MenuWindow: React.FC = () => {
  const [start, setStart] = useState<LocationData | null>(null);
  const [end, setEnd] = useState<LocationData | null>(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [query, setQuery] = useState("");
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [routeInProgress, setRouteInProgress] = useState(false);

  const [saveRoute] = useSaveRouteMutation();

  const handleRetrieve = (res: any, type: "start" | "end") => {
    if (!res.features?.length) return;

    const feature = res.features[0];
    const { properties } = feature;

    const locationData: LocationData = {
      address: properties?.address ?? "",
      fullAddress: properties?.full_address ?? "",
      latitude: properties?.coordinates?.latitude ?? 0,
      longitude: properties?.coordinates?.longitude ?? 0,
    };

    type === "start" ? setStart(locationData) : setEnd(locationData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!start || !end) return;

    try {
      const startPoint = new GeoPoint(start.longitude, start.latitude);
      const endPoint = new GeoPoint(end.longitude, end.latitude);
      const routeGeojson = await buildRoute(startPoint, endPoint);

      if (routeGeojson) {
        setCurrentRoute(routeGeojson);
        setRouteInProgress(true);
        console.log("Created Route:", routeGeojson);
      }
    } catch (error) {
      console.error("Failed to create route", error);
    }
  };

  const handleSave = async () => {
    if (!currentRoute || !start || !end) {
      console.warn("Missing route or location data.");
      return;
    }

    const routeJson: any = {
      user: 1, // Ensure this user exists in DB
      route_name: `${start.address} to ${end.address}`,

      start_latitude: start.latitude,
      start_longitude: start.longitude,
      end_latitude: end.latitude,
      end_longitude: end.longitude,

      start_address: start.fullAddress,
      end_address: end.fullAddress,

      transport_type: currentRoute.weight_name,
      distance_km: +(currentRoute.distance / 1000).toFixed(2),
      duration_min: +(currentRoute.duration / 60).toFixed(2),

      safety_rating: currentRoute.properties?.safety_rating ?? 3,
      traffic_conditions:
        currentRoute.properties?.traffic_conditions ?? "moderate",
      terrain_type: currentRoute.properties?.terrain_type ?? "flat",
      accident_risk_score: currentRoute.properties?.accident_risk_score ?? 50,

      avoid_highways: currentRoute.properties?.avoid_highways ?? false,
      avoid_toll_roads: currentRoute.properties?.avoid_toll_roads ?? false,
      prefer_bike_paths: currentRoute.properties?.prefer_bike_paths ?? true,
      prefer_scenic_routes:
        currentRoute.properties?.prefer_scenic_routes ?? false,

      route_json: currentRoute,
    };

    console.log(routeJson);

    try {
      const result = await saveRoute(routeJson).unwrap();
      console.log("Route saved");

      // Clean up values
      setStart(null);
      setEnd(null);

      // Close route window
      setShowRouteForm(false);
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  return (
    <>
      {!showRouteForm && (
        <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-zinc-950 px-2 py-2 backdrop-blur-md shadow-inner shadow-white/10">
          <div className="flex-grow">
            <SearchBox
              accessToken={String(token)}
              value={query}
              onChange={(val) => setQuery(val)}
              options={{
                proximity: { lng: -122.431297, lat: 37.773972 },
              }}
            />
          </div>
          <Menu as="div" className="relative">
            <MenuButton className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white">
              <PlusIcon className="h-5 w-5" />
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              className="absolute right-0 mt-3 w-40 origin-top-right rounded-xl bg-zinc-950 p-1 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur-xl"
            >
              <MenuItem>
                <button
                  onClick={() => setShowRouteForm(true)}
                  className="w-full px-3 py-1.5 text-left rounded-md hover:bg-white/10"
                >
                  Create Route
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      )}

      {showRouteForm && (
        <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl relative">
          <Button
            onClick={() => setShowRouteForm(false)}
            className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-md"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>

          <form onSubmit={handleSubmit} className="space-y-5 p-6 w-[400px]">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start
              </label>
              <SearchBox
                accessToken={String(token)}
                value={start?.fullAddress || ""}
                onChange={(value) =>
                  setStart({ ...start, fullAddress: value } as LocationData)
                }
                onClear={() => {
                  setStart(null);
                  setRouteInProgress(false);
                }}
                onRetrieve={(res: any) => handleRetrieve(res, "start")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Destination
              </label>
              <SearchBox
                accessToken={String(token)}
                value={end?.fullAddress || ""}
                onChange={(value) =>
                  setEnd({ ...end, fullAddress: value } as LocationData)
                }
                onClear={() => {
                  setEnd(null);
                  setRouteInProgress(false);
                }}
                onRetrieve={(res: any) => handleRetrieve(res, "end")}
              />
            </div>

            <div>
              {!routeInProgress ? (
                <Button
                  type="submit"
                  className="w-full rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-white/5"
                >
                  Route
                </Button>
              ) : (
                <div className="flex row gap-2">
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="w-full rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-white/5"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setRouteInProgress(false)}
                    className="w-full rounded-full bg-red-600/30 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-red-600/20"
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
