"use client";
import dynamic from "next/dynamic";
import Home from "./home/page";

const Menu = dynamic(() => import("./planner/components/menu"), { ssr: false });

export const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Planner() {
  return (
    <div>
      <Home />
    </div>
  );
}
