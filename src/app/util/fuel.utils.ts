import {Fuel} from "../model/fuel";

export class FuelUtils {

  private static FUEL_TEXT_MAP: { [key: string]: string; } = FuelUtils.initFuelTextMap();

  private constructor() {
  }

  public static getTextForFuel(fuel: string): string {
    return FuelUtils.FUEL_TEXT_MAP[fuel] || 'Unknown';
  }

  private static initFuelTextMap(): { [key: string]: string; } {
    let fuelTextMap: { [key: string]: string; } = {};

    fuelTextMap[Fuel.DIESEL] = 'Diesel';
    fuelTextMap[Fuel.ETHANOL] = 'Ethanol';
    fuelTextMap[Fuel.NATURAL_GAS] = 'Natural gas';
    fuelTextMap[Fuel.GASOLINE] = 'Gasoline';
    fuelTextMap[Fuel.ELECTRIC] = 'Electric';

    return fuelTextMap;
  }

}
