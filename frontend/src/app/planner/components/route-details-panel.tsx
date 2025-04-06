"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";

interface RouteDetailsPanelProps {
  route: {
    route_id: number;
    route_name: string;
    distance_km: number;
    duration_min: number;
    start_latitude: string;
    start_longitude: string;
    end_latitude: string;
    end_longitude: string;
    safety_rating: number;
    traffic_conditions: string;
    terrain_type: string;
    accident_risk_score: number;
    avoid_highways: boolean;
    avoid_toll_roads: boolean;
    prefer_bike_paths: boolean;
    prefer_scenic_routes: boolean;
    created_at: string;
  };
}

const detailsTabs = ["General", "Safety", "Advanced"];

export default function RouteDetailsPanel({ route }: RouteDetailsPanelProps) {
  return (
    <div className="menu z-10 bg-zinc-950 backdrop-blur-2xl rounded-2xl">
      <div className="space-y-5 p-6 w-[400px]">
        <TabGroup>
          <TabList className="flex gap-4">
            {detailsTabs.map((tab) => (
              <Tab
                key={tab}
                className="rounded-full py-1 px-3 text-sm font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5"
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-3">
            {/* General Tab */}
            <TabPanel className="rounded-xl bg-white/5 p-4 text-sm text-white space-y-2">
              <div>
                <span className="text-white/60">Route Name:</span>{" "}
                {route.route_name}
              </div>
              <div>
                <span className="text-white/60">Distance:</span>{" "}
                {route.distance_km} km
              </div>
              <div>
                <span className="text-white/60">Duration:</span>{" "}
                {route.duration_min} min
              </div>
              <div>
                <span className="text-white/60">Created:</span>{" "}
                {formatDistanceToNow(new Date(route.created_at))} ago
              </div>
            </TabPanel>

            {/* Safety Tab */}
            <TabPanel className="rounded-xl bg-white/5 p-4 text-sm text-white space-y-2">
              <div>
                <span className="text-white/60">Safety Rating:</span>{" "}
                {route.safety_rating}/5
              </div>
              <div>
                <span className="text-white/60">Traffic:</span>{" "}
                {route.traffic_conditions}
              </div>
              <div>
                <span className="text-white/60">Terrain:</span>{" "}
                {route.terrain_type}
              </div>
              <div>
                <span className="text-white/60">Accident Risk Score:</span>{" "}
                {route.accident_risk_score}
              </div>
            </TabPanel>

            {/* Advanced Tab */}
            <TabPanel className="rounded-xl bg-white/5 p-4 text-sm text-white space-y-2">
              <div>
                <span className="text-white/60">Avoid Highways:</span>{" "}
                {route.avoid_highways ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-white/60">Avoid Toll Roads:</span>{" "}
                {route.avoid_toll_roads ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-white/60">Prefer Bike Paths:</span>{" "}
                {route.prefer_bike_paths ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-white/60">Prefer Scenic Routes:</span>{" "}
                {route.prefer_scenic_routes ? "Yes" : "No"}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
