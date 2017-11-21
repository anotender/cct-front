import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BsModalComponent} from "ng2-bs3-modal";
import {NgProgress} from "ngx-progressbar";
import {ToastrService} from "ngx-toastr";
import {FuelRefill} from "../../model/fuel-refill";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FuelRefillService} from "../../service/fuel-refill.service";

@Component({
  selector: 'app-fuel-refill-form',
  templateUrl: './fuel-refill-form.component.html',
  styleUrls: ['./fuel-refill-form.component.css']
})
export class FuelRefillFormComponent implements OnInit {

  @ViewChild('modal')
  modal: BsModalComponent;

  @Input('carId') carId: number;
  @Output() fuelRefillSaved: EventEmitter<FuelRefill> = new EventEmitter<FuelRefill>();

  liters: FormControl;
  date: FormControl;
  distance: FormControl;
  fuelRefillForm: FormGroup;

  constructor(private fuelRefillService: FuelRefillService,
              private toastr: ToastrService,
              private progress: NgProgress,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.liters = new FormControl(0, [Validators.required, Validators.min(0)]);
    this.distance = new FormControl(0, [Validators.required, Validators.min(0)]);
    this.date = new FormControl(new Date(), [Validators.required]);
    this.fuelRefillForm = this.fb.group({
      liters: this.liters,
      distance: this.distance,
      date: this.date
    });
  }

  submitFuelRefillForm(value): void {
    this.progress.start();

    let fuelRefill: FuelRefill = new FuelRefill();
    fuelRefill.liters = value.liters;
    fuelRefill.distance = value.distance;
    fuelRefill.date = Date.parse(value.date);
    fuelRefill.carId = this.carId;

    this.fuelRefillService
      .save(fuelRefill)
      .subscribe(fuelRefill => {
        this.fuelRefillSaved.emit(fuelRefill);
        this.toastr.success('Fuel refill saved!');
        this.close();
      });
  }

  open(): void {
    this.modal.open();
  }

  private close(): void {
    this.progress.done();
    this.modal.close();
  }

}
