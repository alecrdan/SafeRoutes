"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { formatDistanceToNow } from "date-fns";

const routeCategories = ["All", "Cycling", "Running", "Walking"];

export default function MainModel() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: receivedRoutes = [] } = useGetRoutesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const categorizedRoutes: any = {
    All: receivedRoutes,
    // Cycling: receivedRoutes.filter((route) => route.route_type === "cycling"),
    // Running: receivedRoutes.filter((route) => route.route_type === "running"),
    // Walking: receivedRoutes.filter((route) => route.route_type === "walking"),
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
                  <ul>
                    {categorizedRoutes[category].map((route: any) => (
                      <li
                        key={route.route_id}
                        className="relative rounded-md p-3 text-sm transition hover:bg-white/5"
                      >
                        <div className="font-semibold text-white">
                          {route.route_name}
                        </div>
                        <ul
                          className="flex gap-2 text-white/50 text-xs"
                          aria-hidden="true"
                        >
                          <li>
                            {formatDistanceToNow(new Date(route.created_at))}{" "}
                            ago
                          </li>
                          <li aria-hidden="true">&middot;</li>
                          <li>{route.distance_km} km</li>
                          <li aria-hidden="true">&middot;</li>
                          <li>{route.duration_min} min</li>
                        </ul>
                      </li>
                    ))}
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
