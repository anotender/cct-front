import {DateUtils} from "../util/date.utils";

export class FuelPrice {
  id: string = null;
  fuel: string = null;
  price: number = null;
  date: number = DateUtils.getCurrentTimeInMillis();
  fuelStationId: string = null;
}
