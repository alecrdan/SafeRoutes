export interface Route {
  route_name: string;
  start: { latitude: number; longitude: number; address?: string };
  end: { latitude: number; longitude: number; address?: string };
  distance_km: number;
  duration_min: number;
  safety_rating?: number; // Optional
  traffic_conditions: "light" | "moderate" | "heavy";
  terrain_type: "flat" | "hilly" | "mountainous";
  accident_risk_score: number;
  avoid_highways: boolean;
  avoid_toll_roads: boolean;
  prefer_bike_paths: boolean;
  prefer_scenic_routes: boolean;
  route_json?: any; // Raw API response from Mapbox
  created_at?: string; // Optional, handled by backend
  updated_at?: string; // Optional, handled by backend
}