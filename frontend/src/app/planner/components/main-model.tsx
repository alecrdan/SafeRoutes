"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { formatDistanceToNow } from "date-fns";
import { handleRouteFlyTo } from "@/maps/features/fly-to";
import GeoPoint from "@/maps/utils/schemas/geo/GeoPoint";
import { useState } from "react";

const routeCategories = ["All", "Cycling", "Running", "Walking"];

export default function MainModel() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: receivedRoutes = [] } = useGetRoutesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [selectedRoutes, setSelectedRoutes] = useState<any[]>([]);

  const categorizedRoutes: any = {
    All: receivedRoutes,
    // Cycling: receivedRoutes.filter((r) => r.route_type === "cycling"),
    // Running: receivedRoutes.filter((r) => r.route_type === "running"),
    // Walking: receivedRoutes.filter((r) => r.route_type === "walking"),
  };

  const toggleSelectedRoute = (route: any) => {
    const alreadySelected = selectedRoutes.some(
      (r) => r.route_id === route.route_id
    );
    if (alreadySelected) {
      setSelectedRoutes((prev) =>
        prev.filter((r) => r.route_id !== route.route_id)
      );
    } else {
      setSelectedRoutes((prev) => [...prev, route]);
    }
  };

  const handleClickedRoute = (route: any) => {
    handleRouteFlyTo(
      new GeoPoint(Number(route.start_longitude), Number(route.start_latitude)),
      new GeoPoint(Number(route.end_longitude), Number(route.end_latitude))
    );
  };

  return (
    <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl">
      <div className="space-y-5 p-6 w-[400px]">
        <TabGroup>
          <TabList className="flex gap-4">
            {routeCategories.map((category) => (
              <Tab
                key={category}
                className="rounded-full py-1 px-3 text-sm font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5"
              >
                {category}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {routeCategories.map((category) => (
              <TabPanel key={category} className="rounded-xl bg-white/5 p-3">
                {categorizedRoutes[category]?.length > 0 ? (
                  <ul className="space-y-2">
                    {categorizedRoutes[category].map((route: any) => {
                      const isSelected = selectedRoutes.some(
                        (r) => r.route_id === route.route_id
                      );
                      return (
                        <li
                          key={route.route_id}
                          className={`flex items-start gap-3 rounded-md p-3 text-sm transition ${
                            isSelected ? "bg-white/10" : "hover:bg-white/5"
                          }`}
                        >
                          {/* Left selection button */}
                          <button
                            onClick={() => toggleSelectedRoute(route)}
                            className={`mt-2 h-4 w-4 rounded-full border ${
                              isSelected
                                ? "border-white bg-white text-zinc-950"
                                : "border-white/30 bg-transparent"
                            } flex items-center justify-center transition`}
                          >
                            {isSelected && (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            )}
                          </button>

                          {/* Route content */}
                          <div
                            onClick={() => handleClickedRoute(route)}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-white">
                              {route.route_name}
                            </div>
                            <ul
                              className="flex gap-2 text-white/50 text-xs"
                              aria-hidden="true"
                            >
                              <li>
                                {formatDistanceToNow(
                                  new Date(route.created_at)
                                )}{" "}
                                ago
                              </li>
                              <li aria-hidden="true">&middot;</li>
                              <li>{route.distance_km} km</li>
                              <li aria-hidden="true">&middot;</li>
                              <li>{route.duration_min} min</li>
                            </ul>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-white/50 text-sm">No routes found.</div>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
