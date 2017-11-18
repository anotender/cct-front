import {Fuel} from "../model/fuel";

export class FuelUtils {

  private constructor() {
  }

  public static getTextForFuel(fuel: string): string {
    if (fuel === Fuel.DIESEL) {
      return 'Diesel';
    } else if (fuel === Fuel.ETHANOL) {
      return 'Ethanol';
    } else if (fuel === Fuel.NATURAL_GAS) {
      return 'Natural gas';
    } else if (fuel === Fuel.GASOLINE) {
      return 'Gasoline';
    }
    return 'Unknown';
  }

}
