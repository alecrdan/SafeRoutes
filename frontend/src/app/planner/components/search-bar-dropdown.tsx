"use client";

import { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { token } from "@/app/planner/page";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";

const theme = {
  variables: {
    fontFamily: "Avenir, sans-serif",
    fontWeight: "500",
    fontWeightSemibold: "600",
    fontWeightBold: "700",
    colorBackground: "#0a0a0a",
    colorBackgroundHover: "#1c1c1c",
    colorBackgroundActive: "#2a2a2a",
    colorText: "#ffffff",
    colorPrimary: "#ffffff",
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

export default function SearchBarWithDropdown() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-zinc-950 px-2 py-2 backdrop-blur-md shadow-inner shadow-white/10">
      {/* Mapbox Search */}
      <div className="flex-grow">
        <SearchBox
          accessToken={String(token)}
          theme={theme}
          value={query}
          onChange={(val) => setQuery(val)}
          options={{ proximity: { lng: -122.431297, lat: 37.773972 } }}
        />
      </div>

      {/* Plus Icon with Dropdown */}
      <Menu as="div" className="relative">
        <MenuButton className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white">
          <PlusIcon className="h-5 w-5" />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          className="absolute right-0 mt-3 w-40 origin-top-right rounded-xl bg-zinc-950 p-1 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur-xl"
        >
          <MenuItem>
            <button className="w-full px-3 py-1.5 text-left rounded-md hover:bg-white/10">
              Create Route
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
