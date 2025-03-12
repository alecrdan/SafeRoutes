module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/app/map/map/map-instance.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/page.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-ssr] (ecmascript)");
;
;
;
class Map {
    static instance = null;
    mapRef;
    mapContainerRef;
    constructor(){
        this.mapRef = null;
        this.mapContainerRef = null;
    }
    /** Get the Singleton Instance of Map */ static getInstance() {
        if (!Map.instance) {
            Map.instance = new Map();
        }
        return Map.instance;
    }
    // Set the container and initialize the Map
    setContainer(container) {
        if (this.mapContainerRef !== container) {
            this.mapContainerRef = container;
            this.initMap();
        }
    }
    // Initialize the Mapbox Map
    initMap() {
        if (!this.mapContainerRef || this.mapRef) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["token"];
        // Get current hour on user's machine
        const currentHour = new Date().getHours();
        // Determine light preset based on time of day
        let lightPreset;
        if (currentHour >= 5 && currentHour < 8) {
            lightPreset = "dawn";
        } else if (currentHour >= 8 && currentHour < 18) {
            lightPreset = "day";
        } else if (currentHour >= 18 && currentHour < 21) {
            lightPreset = "dusk";
        } else {
            lightPreset = "night";
        }
        this.mapRef = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Map({
            container: this.mapContainerRef,
            style: "mapbox://styles/mapbox/standard",
            center: [
                -74.006,
                40.7128
            ],
            zoom: 12,
            projection: "globe"
        });
        this.mapRef.on("style.load", ()=>{
            this.mapRef?.setFog({});
            this.mapRef?.setConfigProperty("basemap", "lightPreset", lightPreset);
        });
    }
    /** Return the MapboxGL Instance */ getMap() {
        return this.mapRef;
    }
    /** Remove and Cleanup Map */ removeMap() {
        if (this.mapRef) {
            this.mapRef.remove();
            this.mapRef = null;
        }
    }
}
const __TURBOPACK__default__export__ = Map;
}}),
"[project]/src/app/map/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/map/map-instance.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const MapComponent = ()=>{
    const mapContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mapInstance, setMapInstance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mapContainerRef.current) {
            console.error("Error: Map container is null.");
            return;
        }
        console.log("Initializing map...");
        const mapInstance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getInstance(); // Get the singleton instance
        mapInstance.setContainer(mapContainerRef.current);
        const mapboxMap = mapInstance.getMap();
        if (mapboxMap) {
            setMapInstance(mapboxMap);
        }
        return ()=>{
            console.log("Cleaning up map instance...");
            mapInstance.removeMap();
        };
    }, []);
    // Test
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mapInstance) {}
    }, [
        mapInstance
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: mapContainerRef,
        style: {
            width: "100%",
            height: "100vh",
            background: "#ddd"
        }
    }, void 0, false, {
        fileName: "[project]/src/app/map/page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = MapComponent;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/utils/geo/GeoPoint.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
class GeoPoint {
    longitude;
    latitude;
    constructor(longitude, latitude){
        if (!GeoPoint.isValidLongitude(longitude) || !GeoPoint.isValidLatitude(latitude)) {
            throw new Error("Invalid latitude or longitude values.");
        }
        this.longitude = longitude;
        this.latitude = latitude;
    }
    static isValidLongitude(longitude) {
        return longitude >= -180 && longitude <= 180;
    }
    static isValidLatitude(latitude) {
        return latitude >= -90 && latitude <= 90;
    }
    toArray() {
        return [
            this.longitude,
            this.latitude
        ];
    }
    toString() {
        return `(${this.longitude}, ${this.latitude})`;
    }
    distanceTo(other) {
        // Implement Haversine formula to calculate distance
        const R = 6371; // Earth's radius in km
        const dLat = (other.latitude - this.latitude) * (Math.PI / 180);
        const dLon = (other.longitude - this.longitude) * (Math.PI / 180);
        const lat1 = this.latitude * (Math.PI / 180);
        const lat2 = other.latitude * (Math.PI / 180);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
}
const __TURBOPACK__default__export__ = GeoPoint;
}}),
"[project]/src/app/map/features/create-route.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-ssr] (ecmascript)");
;
class MapRoute {
    type;
    start;
    end;
    mapInstance;
    constructor(mapInstance, type, start, end){
        this.mapInstance = mapInstance;
        this.type = type;
        this.start = start;
        this.end = end;
    }
    static getmapInstance() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken) {
            throw new Error("MapboxGL is not initialized. Set accessToken before using.");
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    }
    async fetchDirections() {
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
    constructPoint(type, coords) {
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
        if (!this.mapInstance.isStyleLoaded()) {
            console.warn(`Waiting for map style before adding ${type} point...`);
            this.mapInstance.once("styledata", ()=>{
                this.addPointToMap(this.mapInstance, pointSourceId, point, type);
            });
        } else {
            this.addPointToMap(this.mapInstance, pointSourceId, point, type);
        }
    }
    constructMarker(mapInstance, type, coords) {
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
            this.mapInstance.once("styledata", ()=>{
                this.addPointToMap(mapInstance, pointSourceId, point, type);
            });
        } else {
            this.addPointToMap(mapInstance, pointSourceId, point, type);
        }
    }
    addPointToMap(mapInstance, sourceId, point, type) {
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
                    "circle-color": type === "start" ? "#34D399" : "#F87171",
                    "circle-emissive-strength": 1.0
                }
            });
        }
    }
    constructRoute() {
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
                        "line-opacity": 0.9,
                        "line-emissive-strength": 1.0
                    }
                });
            }
        }).catch((error)=>console.error("Error constructing route:", error));
    }
}
const __TURBOPACK__default__export__ = MapRoute;
}}),
"[project]/src/app/map/features/fly-to.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "handleRouteFlyTo": (()=>handleRouteFlyTo),
    "handleSearchFlyTo": (()=>handleSearchFlyTo)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/map/map-instance.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$create$2d$route$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/features/create-route.ts [app-ssr] (ecmascript)");
;
;
;
const handleSearchFlyTo = (coords)=>{
    const mapInstance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getInstance()?.getMap();
    if (!mapInstance) {
        console.error("Map instance is not initialized yet.");
        return;
    }
    if (coords) {
        // Add point
        new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$create$2d$route$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]().constructMarker(mapInstance, "search-marker", coords);
        // Fly to
        console.log(coords);
        mapInstance.flyTo({
            center: [
                coords.longitude,
                coords.latitude
            ],
            zoom: 12,
            curve: 1,
            pitch: 40
        });
    } else {
        console.error("Could not fly to location!");
    }
};
const handleRouteFlyTo = (start, end)=>{
    const mapInstance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getInstance()?.getMap();
    if (!mapInstance) {
        console.error("Map instance is not initialized yet.");
        return;
    }
    if (!start || !end) {
        console.error("Invalid start or end points for route.");
        return;
    }
    // Construct the bounding box using the start and end points
    const bounds = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].LngLatBounds([
        start.longitude,
        start.latitude
    ], [
        end.longitude,
        end.latitude
    ]);
    // Extend bounds in case of additional route points
    const routeCoordinates = [
        [
            start.longitude,
            start.latitude
        ],
        [
            end.longitude,
            end.latitude
        ]
    ];
    routeCoordinates.forEach((coord)=>bounds.extend(coord));
    const center = bounds.getCenter();
    mapInstance.flyTo({
        center: center,
        zoom: 12,
        essential: true
    });
};
;
}}),
"[project]/src/app/components/search-bar.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/geo/GeoPoint.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$fly$2d$to$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/features/fly-to.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const SearchBar = ()=>{
    const [coords, setCoords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleRetrieve = (res)=>{
        if (!res.features?.length) {
            console.warn("No features found in response.");
            return;
        }
        const feature = res.features[0];
        if (!feature.geometry || !feature.geometry.coordinates) {
            console.warn("No valid geometry found in feature.");
            return;
        }
        const [longitude, latitude] = feature.geometry.coordinates;
        const geoPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](latitude, longitude);
        setCoords(geoPoint);
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        try {
            console.log("Flying to coords:", coords);
            const sdPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](-117.1611, 32.7157);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$fly$2d$to$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleSearchFlyTo"])(sdPoint);
        } catch (error) {
            console.error("Error in handleFlyTo:", error);
        }
    };
    const theme = {
        variables: {
            fontFamily: "Avenir, sans-serif",
            unit: "14px",
            padding: "15px",
            boxShadow: "0 0 0 1px silver"
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "menu absolute top-5 right-5 z-10 bg-black/75 backdrop-blur-2xl rounded-2xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-5 p-6 w-[450px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: ""
                }, void 0, false, {
                    fileName: "[project]/src/app/components/search-bar.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    className: "flex w-full justify-center rounded-md bg-white/95 px-3 py-2 text-md font-semibold text-black shadow-sm hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200",
                    children: "Search"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/search-bar.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/search-bar.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/search-bar.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = SearchBar;
}}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Home),
    "token": (()=>token)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/page.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$search$2d$bar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/search-bar.tsx [app-ssr] (ecmascript)");
;
"use client";
;
;
;
;
const Menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/src/app/components/menu.tsx [app-ssr] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/src/app/components/menu.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const token = ("TURBOPACK compile-time value", "pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw");
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "navbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Navbar, {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Menu, {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "searchbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$search$2d$bar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "map-container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__df389b22._.js.map