import { token } from "../../app/page";

type Coordinates = [number, number];

class SearchAddress {
  private coords?: Coordinates;
  private address?: string;

  constructor(input: Coordinates | string) {
    if (typeof input === "string") {
      this.address = input;
    } else {
      this.coords = input;
    }
  }

  // Address to Lat/Long
  private async forwardGeocoding() {
    if (!this.address) {
      console.error("No address provided for forward geocoding.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          this.address
        )}&access_token=${token}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Lat/Long to Address
  private async reverseGeocoding() {
    if (!this.coords) {
      console.error("No coordinates provided for reverse geocoding.");
      return;
    }

    const [latitude, longitude] = this.coords;

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${token}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  getGeoPoint() {
    return this.forwardGeocoding();
  }

  getAddressFromCoords() {
    return this.reverseGeocoding();
  }
}
