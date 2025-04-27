export interface Route {
  route_id: string;
  feature_id: string;
  route_name: string;
  transport_type: string;
  start_latitude: string;
  start_longitude: string;
  start_address?: string | null;
  end_latitude: string;
  end_longitude: string;
  end_address?: string | null;
  distance_km: number;
  duration_min: number;
  safety_rating: number;
  traffic_conditions: "light" | "moderate" | "heavy";
  terrain_type: "flat" | "hilly" | "mountainous";
  accident_risk_score: number;
  avoid_highways: boolean;
  avoid_toll_roads: boolean;
  prefer_bike_paths: boolean;
  prefer_scenic_routes: boolean;
  route_json?: any | null;
  created_at: string; // ISO 8601 Date string
  updated_at: string; // ISO 8601 Date string
  user: number; // User ID reference
}

