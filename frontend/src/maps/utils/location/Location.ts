export default interface Location {
  features?: {
    properties?: {
      full_address?: string;
      address?: string;
      context?: {
        place?: { name: string };
        region?: { name: string };
        postcode?: { name: string };
        country?: { name: string };
      };
      coordinates?: {
        latitude?: number;
        longitude?: number;
      };
    };
  }[];
}

