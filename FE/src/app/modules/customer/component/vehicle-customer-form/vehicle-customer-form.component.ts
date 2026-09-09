import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Customer} from "../../model/customer";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../service/customer.service";
import {NotificationService} from "../../../application/services/notification.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Vehicle} from "../../model/vehicle";
import {TranslateService} from "@ngx-translate/core";

export interface DialogData {
  customer: Customer,
  vehicle: Vehicle
}

@Component({
  selector: 'app-add-vehicle-customer',
  standalone: false,
  templateUrl: './vehicle-customer-form.component.html',
  styleUrl: './vehicle-customer-form.component.css'
})
export class VehicleCustomerFormComponent {
  capitalizeFirstLetter = capitalizeFirstLetter;
  form: FormGroup;
  @Output()
  public reloadData = new EventEmitter<Vehicle>;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<VehicleCustomerFormComponent>,
    private readonly translate: TranslateService,
  ) {
    this.form = this.fb.group({
      model: [null, Validators.required],
      vin: [null, Validators.required],
      manufactureYear: [null, Validators.required],
      registrationNumber: [null, Validators.required],
      color: [null],
    });

    if (this.data?.vehicle?.id) {
      this.form.controls['model'].setValue(this.data.vehicle.model);
      this.form.controls['vin'].setValue(this.data.vehicle.vin);
      this.form.controls['manufactureYear'].setValue(this.data.vehicle.manufactureYear);
      this.form.controls['registrationNumber'].setValue(this.data.vehicle.registrationNumber);
      this.form.controls['color'].setValue(this.data.vehicle.color);
    }
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;

      if (!this.data.vehicle?.id) {
        this.data.vehicle = new Vehicle();
      }
      this.data.vehicle.model = values.model;
      this.data.vehicle.vin = values.vin;
      this.data.vehicle.manufactureYear = values.manufactureYear;
      this.data.vehicle.registrationNumber = values.registrationNumber;
      this.data.vehicle.color = values.color;
      this.data.vehicle.customer = this.data.customer

      this.customerService.saveVehicle(this.data.vehicle)
        .subscribe({
          next: (savedVehicle: Vehicle) => {
            if (savedVehicle) {
              if (!this.data.vehicle.id) {
                this.notificationService.saveSuccessMessage();
              }
              else {
                this.notificationService.editSuccessMessage();
              }
              this.closeModal();
              this.reloadData.emit(savedVehicle);
            }
          },
          error: err => {
            console.error(err)
            if (!this.data.vehicle.id) {
              this.notificationService.saveFailedMessage();
            }
            else {
              this.notificationService.editFailedMessage();
            }
          }
        });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
