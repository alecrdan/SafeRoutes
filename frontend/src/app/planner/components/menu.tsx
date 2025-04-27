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
import { useSaveRouteMutation } from "@/redux/features/routes/routesApiSlice";
import { handleSearchFlyTo } from "@/maps/features/fly-to";
import { FaBicycle, FaRunning, FaMountain } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRouteCreation,
  startRouteCreation,
} from "@/redux/features/routes/routeCreationSlice";
import { MapFeature } from "@/maps/utils/schemas/feature/feature";

interface LocationData {
  address: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

type ActivityType = "Cycle" | "Run" | "Hike";

const MenuWindow: React.FC = () => {
  const [start, setStart] = useState<LocationData | null>(null);
  const [end, setEnd] = useState<LocationData | null>(null);
  const [goTo, setGoTo] = useState<LocationData | null>(null);
  const [currentRoute, setCurrentRoute] = useState<MapFeature | null>(null);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityType>("Cycle");

  const activityIcons: Record<ActivityType, any> = {
    Cycle: <FaBicycle className="h-5.5 w-5.5" />,
    Run: <FaRunning className="h-5.5 w-5.5" />,
    Hike: <FaMountain className="h-5.5 w-5.5" />,
  };

  const { isCreating } = useSelector((state: any) => state.routeCreation);
  const dispatch = useDispatch();
  const [saveRoute] = useSaveRouteMutation();

  const handleRetrieve = (
    res: { features?: any[] },
    type: "start" | "end" | "goTo"
  ) => {
    if (!res.features?.length) return;

    const feature = res.features[0];
    const { properties } = feature;

    const locationData: LocationData = {
      address: properties?.address ?? "",
      fullAddress: properties?.full_address ?? "",
      latitude: properties?.coordinates?.latitude ?? 0,
      longitude: properties?.coordinates?.longitude ?? 0,
    };

    switch (type) {
      case "start":
        setStart(locationData);
        break;
      case "end":
        setEnd(locationData);
        break;
      default:
        setGoTo(locationData);
        handleGoTo(locationData);
        break;
    }
  };

  const handleRouteCreateRoute = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!start || !end) return;

    const startPoint = new GeoPoint(start.longitude, start.latitude);
    const endPoint = new GeoPoint(end.longitude, end.latitude);

    try {
      const mapFeature = await buildRoute(startPoint, endPoint);
      if (!mapFeature) {
        console.warn("No route was returned from buildRoute.");
        return;
      }

      setCurrentRoute(mapFeature);
      dispatch(startRouteCreation());
      console.log("Created Route:", mapFeature);
    } catch (error) {
      console.error("Failed to build route", error);
    }
  };

  const handleGoTo = (locationData: LocationData) => {
    try {
      handleSearchFlyTo(
        new GeoPoint(locationData.longitude, locationData.latitude)
      );
    } catch (error) {
      console.error("Error in handleFlyTo:", JSON.stringify(error));
    }
  };

  const handleSave = async () => {
    if (!currentRoute || !start || !end) {
      console.warn("Missing route or location data.");
      return;
    }

    const routeJson: any = {
      user: 1,
      feature_id: currentRoute.id,
      route_name: `${start.address} to ${end.address}`,
      start_latitude: start.latitude,
      start_longitude: start.longitude,
      end_latitude: end.latitude,
      end_longitude: end.longitude,
      start_address: start.fullAddress,
      end_address: end.fullAddress,
      transport_type: currentRoute.feature.properties?.weight_name ?? "unknown",
      distance_km: +(
        currentRoute.feature.properties?.distance / 1000 || 0
      ).toFixed(2),
      duration_min: +(
        currentRoute.feature.properties?.duration / 60 || 0
      ).toFixed(2),
      safety_rating: currentRoute.feature.properties?.safety_rating ?? 3,
      traffic_conditions:
        currentRoute.feature.properties?.traffic_conditions ?? "moderate",
      terrain_type: currentRoute.feature.properties?.terrain_type ?? "flat",
      accident_risk_score:
        currentRoute.feature.properties?.accident_risk_score ?? 50,
      avoid_highways: currentRoute.feature.properties?.avoid_highways ?? false,
      avoid_toll_roads:
        currentRoute.feature.properties?.avoid_toll_roads ?? false,
      prefer_bike_paths:
        currentRoute.feature.properties?.prefer_bike_paths ?? true,
      prefer_scenic_routes:
        currentRoute.feature.properties?.prefer_scenic_routes ?? false,
      route_json: currentRoute,
    };

    try {
      await saveRoute(routeJson).unwrap();
      console.log("Route saved:", routeJson);

      dispatch(cancelRouteCreation());
      setStart(null);
      setEnd(null);
      setShowRouteForm(false);
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!showRouteForm && (
          <motion.div className="flex w-[370px] items-center gap-2 rounded-xl bg-zinc-950 px-2 py-2 backdrop-blur-md shadow-inner shadow-white/10">
            <Menu as="div" className="relative">
              <MenuButton
                title={selectedActivity}
                className="flex items-center gap-x-2 rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
                {activityIcons[selectedActivity]}
              </MenuButton>

              <MenuItems className="absolute left-0 mt-3 w-28 origin-top-right rounded-xl bg-zinc-950 p-1 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur-xl">
                {(["Cycle", "Run", "Hike"] as ActivityType[]).map(
                  (activity) => (
                    <MenuItem key={activity}>
                      <button
                        onClick={() => setSelectedActivity(activity)}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left rounded-md hover:bg-white/10">
                        {activityIcons[activity]}
                        {activity}
                      </button>
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>

            <div className="flex-grow">
              <SearchBox
                onRetrieve={(res: any) => handleRetrieve(res, "goTo")}
                accessToken={String(token)}
                value={goTo?.fullAddress || ""}
                options={{
                  proximity: { lng: -122.431297, lat: 37.773972 },
                }}
              />
            </div>

            <Menu as="div" className="relative">
              <MenuButton
                title="Create Route"
                onClick={() => setShowRouteForm((prev) => !prev)}
                className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white">
                {showRouteForm ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <PlusIcon className="h-5 w-5" />
                )}
              </MenuButton>
            </Menu>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showRouteForm && (
          <motion.div
            key="route-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl relative">
            <Button
              onClick={() => setShowRouteForm(false)}
              className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-md">
              <XMarkIcon className="w-5 h-5" />
            </Button>

            <form
              className="space-y-5 p-6 w-[370px]"
              onSubmit={handleRouteCreateRoute}>
              <div>
                <label className="block mt-0 text-md font-medium text-white mb-3">
                  Create Route
                </label>
                <label className="block text-xs text-white/60 mb-1">
                  Start
                </label>
                <SearchBox
                  accessToken={String(token)}
                  value={start?.fullAddress || ""}
                  onChange={(value) =>
                    setStart({ ...start, fullAddress: value } as LocationData)
                  }
                  onClear={() => setStart(null)}
                  onRetrieve={(res: any) => handleRetrieve(res, "start")}
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Destination
                </label>
                <SearchBox
                  accessToken={String(token)}
                  value={end?.fullAddress || ""}
                  onChange={(value) =>
                    setEnd({ ...end, fullAddress: value } as LocationData)
                  }
                  onClear={() => setEnd(null)}
                  onRetrieve={(res: any) => handleRetrieve(res, "end")}
                />
              </div>

              <div>
                {!isCreating ? (
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-white/5">
                    Route
                  </Button>
                ) : (
                  <div className="flex row gap-2">
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="w-full rounded-full bg-white/10 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-white/5">
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={() => dispatch(cancelRouteCreation())}
                      className="w-full rounded-full bg-red-600/30 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-red-600/20">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuWindow;
