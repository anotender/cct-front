export class MapUtils {

  public static computeDistanceBetweenCoordinates(lat1: number, lng1: number, lat2: number, lng2: number): number {
    let p: number = 0.017453292519943295;    // Math.PI / 180
    let a: number = 0.5 - Math.cos((lat2 - lat1) * p) / 2 +
      Math.cos(lat1 * p) * Math.cos(lat2 * p) *
      (1 - Math.cos((lng2 - lng1) * p)) / 2;
    return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R * 1000; R = 6371 km
  }

}
