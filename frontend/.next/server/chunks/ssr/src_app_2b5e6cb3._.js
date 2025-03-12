module.exports = {

"[project]/src/app/map/features/create-route.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * @file MapRoute.ts
 * @description This module defines the `MapRoute` class, which facilitates
 * route visualization using Mapbox. It includes methods to add points (start/end),
 * fetch route directions from the Mapbox API, and render the route on a map.
 *
 * @requires mapboxgl - The Mapbox GL library for rendering maps.
 * @requires GeoPoint - A utility class representing geographical coordinates.
 */ __turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-ssr] (ecmascript)");
;
/**
 * Represents a route on a Mapbox map. It allows for adding start and end points,
 * fetching directions, and rendering routes dynamically.
 */ class MapRoute {
    type;
    start;
    end;
    mapInstance;
    /**
   * Creates an instance of `MapRoute`.
   *
   * @param mapInstance - The Mapbox map instance.
   * @param type - The routing profile (e.g., "driving", "walking", "cycling").
   * @param start - The starting point of the route.
   * @param end - The destination point of the route.
   */ constructor(mapInstance, type, start, end){
        this.mapInstance = mapInstance;
        this.type = type;
        this.start = start;
        this.end = end;
    }
    /**
   * Retrieves the Mapbox instance and ensures accessToken is set.
   *
   * @throws Error if MapboxGL is not initialized with an accessToken.
   * @returns The MapboxGL instance.
   */ static getmapInstance() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken) {
            throw new Error("MapboxGL is not initialized. Set accessToken before using.");
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    }
    /**
   * Fetches the route directions from Mapbox's Directions API.
   *
   * @returns A GeoJSON LineString feature representing the route or `null` if an error occurs.
   */ async fetchDirections() {
        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/${this.type}/${this.start.longitude},${this.start.latitude};${this.end.longitude},${this.end.latitude}?steps=true&geometries=geojson&access_token=${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
            const data = await response.json();
            if (!data.routes || data.routes.length === 0) throw new Error("No routes found.");
            return {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: data.routes[0].geometry.coordinates
                }
            };
        } catch (error) {
            console.error("Error fetching route:", error);
            return null;
        }
    }
    /**
   * Adds a point (start or end) to the map.
   *
   * @param arg1 - Either the point type (`"start"` or `"end"`) or the Mapbox instance.
   * @param arg2 - Either the GeoPoint coordinates or the point type.
   * @param arg3 - The GeoPoint coordinates (if the first argument is a Mapbox instance).
   *
   * This function determines which overload is used and adds a point to the correct map instance.
   */ constructPoint(arg1, arg2, arg3) {
        let mapInstance;
        let type;
        let coords;
        if (typeof arg1 === "string") {
            // First overload: constructPoint(type, coords)
            mapInstance = this.mapInstance;
            type = arg1;
            coords = arg2;
        } else {
            // Second overload: constructPoint(mapInstance, type, coords)
            mapInstance = arg1;
            type = arg2;
            coords = arg3;
        }
        const pointSourceId = `${type}-point`;
        const point = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Point",
                        coordinates: coords.toArray()
                    }
                }
            ]
        };
        if (!mapInstance.isStyleLoaded()) {
            console.warn(`Waiting for map style before adding ${type} point...`);
            mapInstance.once("styledata", ()=>{
                this.addPointToMap(mapInstance, pointSourceId, point, type);
            });
        } else {
            this.addPointToMap(mapInstance, pointSourceId, point, type);
        }
    }
    /**
   * Adds a GeoJSON point source and layer to the map.
   *
   * @param mapInstance - The Mapbox map instance.
   * @param sourceId - The unique ID for the point source.
   * @param point - The GeoJSON data representing the point.
   * @param type - The type of point (`"start"` or `"end"`).
   *
   * If the source already exists, this method updates its data. Otherwise, it creates
   * a new source and a circle layer representing the point.
   */ addPointToMap(mapInstance, sourceId, point, type) {
        const existingSource = mapInstance.getSource(sourceId);
        if (existingSource) {
            existingSource.setData(point);
        } else {
            mapInstance.addSource(sourceId, {
                type: "geojson",
                data: point
            });
            mapInstance.addLayer({
                id: `${type}-marker`,
                type: "circle",
                source: sourceId,
                paint: {
                    "circle-radius": 10,
                    "circle-color": type === "start" ? "#34D399" : "#F87171"
                }
            });
        }
    }
    /**
   * Constructs and renders the route on the map by fetching directions from Mapbox.
   *
   * If a route already exists, it updates the route data. Otherwise, it creates a new
   * route layer and displays the path.
   */ constructRoute() {
        this.fetchDirections().then((geojson)=>{
            if (!geojson) return;
            const existingSource = this.mapInstance.getSource("route");
            if (existingSource) {
                existingSource.setData(geojson);
            } else {
                this.mapInstance.addSource("route", {
                    type: "geojson",
                    data: geojson
                });
                this.mapInstance.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    paint: {
                        "line-color": "#2563EB",
                        "line-width": 10,
                        "line-opacity": 0.8
                    }
                });
            }
        }).catch((error)=>console.error("Error constructing route:", error));
    }
}
const __TURBOPACK__default__export__ = MapRoute;
}}),
"[project]/src/app/controllers/route-controller.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$create$2d$route$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/features/create-route.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/map/map-instance.ts [app-ssr] (ecmascript)");
;
;
const mapInstance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getInstance().getMap();
const handleRoute = (start, end)=>{
    if (!mapInstance) {
        console.error("Map instance is not initialized.");
        return;
    }
    const route = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$create$2d$route$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](mapInstance, "cycling", start, end);
    route.constructRoute();
    route.constructPoint("start", start);
    route.constructPoint("end", end);
};
const __TURBOPACK__default__export__ = handleRoute;
}}),
"[project]/src/app/components/menu.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/geo/GeoPoint.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$controllers$2f$route$2d$controller$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/controllers/route-controller.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$fly$2d$to$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/features/fly-to.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const Menu = ()=>{
    const [start, setStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [end, setEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleRetrieve = (res, type)=>{
        if (!res.features?.length) {
            console.warn("No features found in response.");
            return;
        }
        const feature = res.features[0];
        if (!feature.properties) return;
        const { properties } = feature;
        const { context, coordinates } = properties;
        const locationData = {
            address: properties.address ?? "",
            fullAddress: properties.full_address ?? "",
            latitude: coordinates?.latitude ?? 0,
            longitude: coordinates?.longitude ?? 0
        };
        type === "start" ? setStart(locationData) : setEnd(locationData);
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        // if (!start || !end) {
        //   console.error("Start or End location is missing.");
        //   return;
        // }
        try {
            // let startGeoPoint = new GeoPoint(start.longitude, start.latitude);
            // let endGeoPoint = new GeoPoint(end.longitude, end.latitude);
            // console.log("Start GeoPoint:", startGeoPoint.toString());
            // console.log("End GeoPoint:", endGeoPoint.toString());
            // const distance = startGeoPoint.distanceTo(endGeoPoint);
            // Hardcoded Values to save API tokens
            const one = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](-73.9855, 40.758);
            const two = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](-74.017, 40.7033);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$controllers$2f$route$2d$controller$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(one, two);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$fly$2d$to$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleRouteFlyTo"])(one, two);
        // console.log(`Distance: ${distance.toFixed(2)} km`);
        } catch (error) {
            console.error("Failed to create route");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "menu absolute top-5 left-5 z-10 bg-black/85 backdrop-blur-md rounded-xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-5 p-6 w-[450px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-100",
                            children: "Start"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/menu.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-100",
                            children: "Destination"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/menu.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-black shadow-sm hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200",
                        children: "Route"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/menu.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/menu.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/menu.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/menu.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Menu;
}}),
"[project]/src/app/components/menu.tsx [app-ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/components/menu.tsx [app-ssr] (ecmascript)"));
}}),

};

//# sourceMappingURL=src_app_2b5e6cb3._.js.map