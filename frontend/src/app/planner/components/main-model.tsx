"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { useGetRoutesQuery } from "@/redux/features/routes/routesApiSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { formatDistanceToNow } from "date-fns";
import { handleRouteFlyTo } from "@/maps/features/fly-to";
import GeoPoint from "@/maps/utils/schemas/geo/GeoPoint";
import { useEffect, useState } from "react";
import { Route } from "@/maps/utils/schemas/route/route";
import {
  addFeatureIds,
  clearFeatureIds,
} from "@/redux/features/routes/focusedRouteSlice";
import { focusFeature } from "@/maps/services/layer/layerHub";
import { selectAllRoutes } from "@/redux/features/routes/featureSlice";

const routeCategories = ["All", "Cycling", "Running", "Walking"] as const;
type Category = (typeof routeCategories)[number];

export default function MainModel() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data: receivedRoutes = [] } = useGetRoutesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const allFeatureStore = useAppSelector(selectAllRoutes);

  const [selectedRoutes, setSelectedRoutes] = useState<Route[]>([]);
  const [focusedRoute, setFocusedRoute] = useState<Route | null>(null);

  const categorizedRoutes: Record<Category, Route[]> = {
    All: receivedRoutes,
    Cycling: receivedRoutes.filter((r) => r.transport_type === "cycling"),
    Running: receivedRoutes.filter((r) => r.transport_type === "running"),
    Walking: receivedRoutes.filter((r) => r.transport_type === "walking"),
  };

  // Update the focused route in the Redux store
  useEffect(() => {
    dispatch(clearFeatureIds());
    if (focusedRoute?.feature_id) {
      dispatch(addFeatureIds([focusedRoute.feature_id]));
      focusFeature(focusedRoute.feature_id);
    }

  }, [focusedRoute]);

  const toggleSelectedRoute = (route: Route) => {
    const alreadySelected = selectedRoutes.some(
      (r) => r.feature_id === route.feature_id
    );
    if (alreadySelected) {
      setSelectedRoutes((prev) =>
        prev.filter((r) => r.feature_id !== route.feature_id)
      );
    } else {
      setSelectedRoutes((prev) => [...prev, route]);
    }
  };

  const toggleFocusedRoute = (route: Route) => {
    if (route.feature_id !== focusedRoute?.feature_id) {
      setFocusedRoute(route);
      setSelectedRoutes([]);
    }
  };

  const handleClickedRoute = (route: Route) => {
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
                className="rounded-full py-1 px-3 text-sm font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5">
                {category}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {routeCategories.map((category) => (
              <TabPanel key={category} className="rounded-xl bg-white/5 p-3">
                {categorizedRoutes[category]?.length > 0 ? (
                  <ul className="space-y-2">
                    {categorizedRoutes[category].map((route) => {
                      const isSelected = selectedRoutes.some(
                        (r) => r.feature_id === route.feature_id
                      );

                      return (
                        <li
                          key={route.feature_id}
                          className={`flex items-start gap-3 rounded-md p-3 text-sm transition ${
                            isSelected ||
                            focusedRoute?.feature_id === route.feature_id
                              ? "bg-white/10"
                              : "hover:bg-white/5"
                          }`}>
                          {/* Left selection button */}
                          <button
                            onClick={() => toggleSelectedRoute(route)}
                            className={`mt-2 h-4 w-4 rounded-full border ${
                              isSelected
                                ? "border-white bg-white text-zinc-950"
                                : "border-white/30 bg-transparent"
                            } flex items-center justify-center transition`}>
                            {isSelected && (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            )}
                          </button>

                          {/* Route content (center) */}
                          <div
                            onClick={() => {
                              handleClickedRoute(route);
                              toggleFocusedRoute(route);
                            }}
                            className="flex-1 cursor-pointer">
                            <div className="font-semibold text-white">
                              {route.route_name}
                            </div>
                            <ul
                              className="flex gap-2 text-white/50 text-xs"
                              aria-hidden="true">
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

                          {/* Dropdown menu (far right) */}
                          <Menu as="div" className="relative">
                            <MenuButton className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white">
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </MenuButton>
                            <MenuItems
                              anchor="bottom end"
                              className="absolute z-20 right-0 mt-2 w-28 origin-top-right rounded-xl bg-zinc-900 p-1 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    console.log(
                                      "Delete route:",
                                      route.feature_id
                                    );
                                  }}
                                  className="w-full px-3 py-1.5 text-left rounded-md hover:bg-white/10">
                                  Delete
                                </button>
                              </MenuItem>
                            </MenuItems>
                          </Menu>
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
