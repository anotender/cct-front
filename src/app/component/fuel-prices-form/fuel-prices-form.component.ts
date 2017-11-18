import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsModalComponent} from "ng2-bs3-modal";
import {FuelPrice} from "../../model/fuel-price";
import {NgProgress} from "ngx-progressbar";
import {FuelPriceService} from "../../service/fuel-price.service";
import {Fuel} from "../../model/fuel";
import {Observable} from "rxjs/Observable";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-fuel-prices-form',
  templateUrl: './fuel-prices-form.component.html',
  styleUrls: ['./fuel-prices-form.component.css']
})
export class FuelPricesFormComponent implements OnInit {

  @ViewChild('modal')
  modal: BsModalComponent;

  @Input('fuelStationId') fuelStationId: string;
  @Output() fuelPricesSaved: EventEmitter<FuelPrice[]> = new EventEmitter<FuelPrice[]>();

  dieselPrice: FuelPrice = null;
  gasolinePrice: FuelPrice = null;
  naturalGasPrice: FuelPrice = null;
  ethanolPrice: FuelPrice = null;

  constructor(private fuelPriceService: FuelPriceService,
              private toastr: ToastrService,
              private progress: NgProgress) {
  }

  ngOnInit(): void {
    this.progress.start();
    this.initFuelPrices();
    this.progress.done();
  }

  submitFuelPricesForm(): void {
    this.progress.start();
    Observable
      .forkJoin(this.getUpdatedPrices().map(fuelPrice => this.fuelPriceService.save(fuelPrice)))
      .subscribe(fuelPrices => {
        this.fuelPricesSaved.emit(fuelPrices);
        this.toastr.success('Updated fuel prices');
        this.progress.done();
        this.close();
      });
  }

  open(): void {
    this.modal.open();
  }

  isFormValid(): boolean {
    return this.getUpdatedPrices().length !== 0;
  }

  private getUpdatedPrices(): FuelPrice[] {
    return [this.dieselPrice, this.gasolinePrice, this.naturalGasPrice, this.ethanolPrice].filter(p => p.price != null);
  }

  private close(): void {
    this.progress.done();
    this.modal.close();
    this.initFuelPrices();
  }

  private initFuelPrices(): void {
    this.dieselPrice = new FuelPrice();
    this.dieselPrice.fuel = Fuel.DIESEL;
    this.dieselPrice.fuelStationId = this.fuelStationId;

    this.gasolinePrice = new FuelPrice();
    this.gasolinePrice.fuel = Fuel.GASOLINE;
    this.gasolinePrice.fuelStationId = this.fuelStationId;

    this.naturalGasPrice = new FuelPrice();
    this.naturalGasPrice.fuel = Fuel.NATURAL_GAS;
    this.naturalGasPrice.fuelStationId = this.fuelStationId;

    this.ethanolPrice = new FuelPrice();
    this.ethanolPrice.fuel = Fuel.ETHANOL;
    this.ethanolPrice.fuelStationId = this.fuelStationId;
  }

}
