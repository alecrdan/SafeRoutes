class GeoPoint {
  longitude: number;
  latitude: number;

  constructor(longitude: number, latitude: number) {
    if (
      !GeoPoint.isValidLongitude(longitude) ||
      !GeoPoint.isValidLatitude(latitude)
    ) {
      throw new Error("Invalid latitude or longitude values.");
    }

    this.longitude = longitude;
    this.latitude = latitude;
  }

  static isValidLongitude(longitude: number): boolean {
    return longitude >= -180 && longitude <= 180;
  }

  static isValidLatitude(latitude: number): boolean {
    return latitude >= -90 && latitude <= 90;
  }

  toArray(): [number, number] {
    return [this.longitude, this.latitude];
  }

  toString(): string {
    return `(${this.longitude}, ${this.latitude})`;
  }

  distanceTo(other: GeoPoint): number {
    // Implement Haversine formula to calculate distance
    const R = 6371; // Earth's radius in km
    const dLat = (other.latitude - this.latitude) * (Math.PI / 180);
    const dLon = (other.longitude - this.longitude) * (Math.PI / 180);
    const lat1 = this.latitude * (Math.PI / 180);
    const lat2 = other.latitude * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  }
}

export default GeoPoint;
