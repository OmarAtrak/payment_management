import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {Invoice} from "../../model/invoice";
import {Service} from "../../../work/model/service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {WorkService} from "../../../work/service/work.service";
import {ServiceItem} from "../../model/service-item";
import {InvoiceService} from "../../service/invoice.service";
import {Vehicle} from "../../../customer/model/vehicle";

export interface DialogData {
  invoice: Invoice,
  serviceItem: ServiceItem
}

@Component({
  selector: 'app-add-service-for-invoice',
  standalone: false,
  templateUrl: './service-for-invoice.component.html',
  styleUrl: './service-for-invoice.component.css'
})
export class ServiceForInvoiceComponent  implements  OnInit {
  services: Array<Service> = [];
  isLoadingAllServices: boolean = false;
  form: FormGroup;
  @Output()
  reloadData = new EventEmitter<void>;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly workService: WorkService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<ServiceForInvoiceComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly invoiceService: InvoiceService,
  ) {
    this.form = this.fb.group({
      service: [null, Validators.required],
      price: [1, [Validators.required, Validators.min(0)]],
      vehicle: [null, Validators.required],
    });

    if (this.data?.serviceItem?.id) {
      this.form.controls['service'].setValue(this.data.serviceItem.service.id);
      this.form.controls['service'].disable();
      this.form.controls['price'].setValue(this.data.serviceItem.price);
      this.form.controls['vehicle'].setValue(this.data.serviceItem?.vehicle?.id ?? null);
    }
  }

  ngOnInit() {
    this.getAllService();
  }

  getAllService(): void {
    this.services = [];
    this.isLoadingAllServices = false;

    this.workService.getAll(1, 1000)
      .subscribe({
        next: (httpResponse: any) => {
          const data = httpResponse.content;

          if (data) {
            this.services = data.map((service: any) => Service.fromJson(service));
            this.isLoadingAllServices = true;
          }
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submitServiceItem() {
    if (this.form.valid) {
      if (!this.data?.serviceItem?.id) {
        this.data.serviceItem = new ServiceItem();
        this.data.serviceItem.service = this.services.find(p => p.id == this.form.value.service)!;
      }
      this.data.serviceItem.active = true;
      this.data.serviceItem.price = this.form.value.price;
      this.data.serviceItem.discount = this.data.serviceItem.service.price - this.data.serviceItem.price;
      const vehicle = new Vehicle();
      vehicle.id = this.form.value.vehicle;
      this.data.serviceItem.vehicle = vehicle;
      this.data.serviceItem.tax = this.data.serviceItem.service.tax;
      this.data.serviceItem.priceTTC = this.data.serviceItem.price * (1 + this.data.serviceItem.tax.rate);

      this.invoiceService.saveServiceItem(this.data.invoice.id, this.data.serviceItem)
        .subscribe({
          next: () => {
            if (!this.data.serviceItem.id) {
              this.notificationService.saveSuccessMessage();
            } else {
              this.notificationService.editSuccessMessage();
            }
            this.reloadData.emit();
            this.closeModal();
          },
          error: err => {
            console.error(err);
            this.notificationService.showServerErrorMessage();
          }
        });
    }
  }

  onServiceSelect(event: any): void {
    const selectedService = this.services.find(p => p.id == event.id);
    if (selectedService) {
      this.form.patchValue({ price: selectedService.price });
    }
  }
}
