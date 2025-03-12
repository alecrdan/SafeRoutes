(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_5f415354._.js", {

"[project]/src/app/utils/geo/GeoPoint.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/map/features/create-route.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mapbox-gl/dist/mapbox-gl.js [app-client] (ecmascript)");
;
class MapRoute {
    type;
    start;
    end;
    instance;
    constructor(instance, type, start, end){
        this.instance = instance;
        this.type = type;
        this.start = start;
        this.end = end;
    }
    static getInstance() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].accessToken) {
            throw new Error("MapboxGL is not initialized. Set accessToken before using.");
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    }
    async fetchDirections() {
        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/${this.type}/${this.start.longitude},${this.start.latitude};${this.end.longitude},${this.end.latitude}?steps=true&geometries=geojson&access_token=${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].accessToken}`;
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
        if (!this.instance.isStyleLoaded()) {
            console.warn(`Waiting for map style before adding ${type} point...`);
            this.instance.once("styledata", ()=>{
                this.addPointToMap(pointSourceId, point, type);
            });
        } else {
            this.addPointToMap(pointSourceId, point, type);
        }
    }
    addPointToMap(sourceId, point, type) {
        const existingSource = this.instance.getSource(sourceId);
        if (existingSource) {
            existingSource.setData(point);
        } else {
            this.instance.addSource(sourceId, {
                type: "geojson",
                data: point
            });
            this.instance.addLayer({
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
    constructRoute() {
        this.fetchDirections().then((geojson)=>{
            if (!geojson) return;
            const existingSource = this.instance.getSource("route");
            if (existingSource) {
                existingSource.setData(geojson);
            } else {
                this.instance.addSource("route", {
                    type: "geojson",
                    data: geojson
                });
                this.instance.addLayer({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/controllers/route-controller.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$create$2d$route$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/features/create-route.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/map/map/map-instance.ts [app-client] (ecmascript)");
;
;
const mapInstance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$map$2f$map$2d$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getInstance().getMap();
const handleRoute = (start, end)=>{
    if (!mapInstance) {
        console.error("Map instance is not initialized.");
        return;
    }
    const route = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$map$2f$features$2f$create$2d$route$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](mapInstance, "cycling", start, end);
    route.constructRoute();
    route.constructPoint("start", start);
    route.constructPoint("end", end);
};
const __TURBOPACK__default__export__ = handleRoute;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/menu.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mapbox$2f$search$2d$js$2d$react$2f$dist$2f$index$2d$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@mapbox/search-js-react/dist/index-esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mapbox$2f$search$2d$js$2d$react$2f$dist$2f$index$2d$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@mapbox/search-js-react/dist/index-esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/geo/GeoPoint.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$controllers$2f$route$2d$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/controllers/route-controller.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const Menu = ()=>{
    _s();
    const [start, setStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [end, setEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
        if (!start || !end) {
            console.error("Start or End location is missing.");
            return;
        }
        try {
            let startGeoPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](start.longitude, start.latitude);
            let endGeoPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$geo$2f$GeoPoint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](end.longitude, end.latitude);
            console.log("Start GeoPoint:", startGeoPoint.toString());
            console.log("End GeoPoint:", endGeoPoint.toString());
            const distance = startGeoPoint.distanceTo(endGeoPoint);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$controllers$2f$route$2d$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(startGeoPoint, endGeoPoint);
            console.log(`Distance: ${distance.toFixed(2)} km`);
        } catch (error) {
            console.error("Failed to create route");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "menu absolute top-5 left-5 z-10 bg-black/85 backdrop-blur-md rounded-xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-5 p-6 w-[450px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-100",
                            children: "Start"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mapbox$2f$search$2d$js$2d$react$2f$dist$2f$index$2d$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SearchBox"], {
                                accessToken: "pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw",
                                options: {
                                    proximity: {
                                        lng: -122.431297,
                                        lat: 37.773972
                                    }
                                },
                                value: start?.fullAddress || "",
                                onChange: (value)=>setStart({
                                        ...start,
                                        fullAddress: value
                                    }),
                                onRetrieve: (res)=>handleRetrieve(res, "start")
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/menu.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/menu.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-100",
                            children: "Destination"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mapbox$2f$search$2d$js$2d$react$2f$dist$2f$index$2d$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SearchBox"], {
                                accessToken: "pk.eyJ1IjoiYWxlY3JkYW4iLCJhIjoiY203ejdtdmVhMGlocDJrcTQxY3Juamg0aiJ9.4PKhiLg4cZmfj0FOMXqeBw",
                                options: {
                                    proximity: {
                                        lng: -122.431297,
                                        lat: 37.773972
                                    }
                                },
                                value: end?.fullAddress || "",
                                onChange: (value)=>setEnd({
                                        ...end,
                                        fullAddress: value
                                    }),
                                onRetrieve: (res)=>handleRetrieve(res, "end")
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/menu.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/menu.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/menu.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-black shadow-sm hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200",
                        children: "Route"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/menu.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/menu.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/menu.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/menu.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
};
_s(Menu, "S9YjnctGbg1Dvu3Fydfv7tNnxIA=");
_c = Menu;
const __TURBOPACK__default__export__ = Menu;
var _c;
__turbopack_context__.k.register(_c, "Menu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/menu.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/components/menu.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=src_app_5f415354._.js.map