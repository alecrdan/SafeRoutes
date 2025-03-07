"use client"

import React, { useState } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";

const Menu: React.FC = () => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");

  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value);
  };

  const handleChangeDest = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      let startGeoPoint = new SearchAddress(start).getGeoPoint();
      let destinationGeoPoint = new SearchAddress(destination).getGeoPoint();

          // Updates the value in the redux store -> Map will be updated with route bc there will be observers


    console.log("Start:", startGeoPoint);
    console.log("Destination:", destinationGeoPoint);
    } catch {
      console.log("Failed to translate addresses to GeoPoints!")
    }
  };

  return (
    <div className="menu absolute top-5 left-5 z-10 bg-slate-950/90 backdrop-blur-md rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-7 w-[450px]">
        {/* Start Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Start
          </label>
          <div className="mt-2">
            <AddressAutofill accessToken="pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw">
              <input
                autoComplete="shipping address-line1"
                value={start}
                onChange={handleChangeStart}
                className="block w-full rounded-md bg-gray-800/90 backdrop-blur-md px-3 py-1.5 text-base text-gray-100 outline outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              />
            </AddressAutofill>
          </div>
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Destination
          </label>
          <div className="mt-2">
            <AddressAutofill accessToken="pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw">
              <input
                autoComplete="shipping address-line1"
                value={destination}
                onChange={handleChangeDest}
                className="block w-full rounded-md bg-gray-800/90 backdrop-blur-md px-3 py-1.5 text-base text-gray-100 outline outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              />
            </AddressAutofill>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Route
          </button>
        </div>
      </form>
    </div>
  );
};

export default Menu;
