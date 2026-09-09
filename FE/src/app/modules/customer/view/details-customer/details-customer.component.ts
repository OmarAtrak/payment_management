import {Component, OnInit} from '@angular/core';
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {VehicleCustomerFormComponent} from "../../component/vehicle-customer-form/vehicle-customer-form.component";
import {MatDialog} from "@angular/material/dialog";
import {Vehicle} from "../../model/vehicle";

@Component({
  selector: 'app-details-customer',
  standalone: false,
  templateUrl: './details-customer.component.html',
  styleUrl: './details-customer.component.css'
})
export class DetailsCustomerComponent implements OnInit {
  customer: Customer = new Customer();
  isLoading: boolean = false;
  id: number;
  capitalizeFirstLetter = capitalizeFirstLetter;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }


  constructor(
    private readonly customerService: CustomerService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe((params) => {
        const id = params.get('id');
        if (id != undefined) {
          this.id = Number(id);
        }
      });

    // get customer by id
    this.getCustomer(this.id);
  }

  getCustomer(id: number): void {
    this.customerService.get(id)
      .subscribe({
        next: response => {
          this.customer = Customer.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  showDialogConfirmDelete(): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.customer_will_be_deleted');

    // sweet alert
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: false,
      focusCancel: true,
      confirmButtonText: this.translate.instant('operation.delete'),
      cancelButtonText: this.translate.instant('cancel'),
    })
      .then((result) => {
        if (result.isConfirmed) {
          // if user confirm delete
          this.customerService.delete(this.customer.id)
            .subscribe({
              next: () => {
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.customer_deleted'), 'success')
                  .then(() => {
                    this.router.navigateByUrl('/customers');
                  });
              },
              error: err => {
                console.error(err);
                Swal.fire(this.translate.instant('operation.operation_failed'), '', 'error');
              }
            });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          // if user cancel delete
          Swal.fire(this.translate.instant('cancel'), '', 'error');
        }
      })
      .catch(error => {
        console.error(error);
        this.notificationService.showServerErrorMessage();
      });
  }

  openVehicleCustomerFormForAddDialog(): void {
    const dialogRef = this.dialog.open(VehicleCustomerFormComponent, {
      data: {
        customer: this.customer,
      },
      position: {top: '100px'},
      width: '30%'
    });

    dialogRef.componentInstance.reloadData.subscribe(() => {
      this.getCustomer(this.id);
    });
  }

  openVehicleCustomerFormForEditDialog(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleCustomerFormComponent, {
      data: {
        customer: this.customer,
        vehicle: vehicle
      },
      position: {top: '100px'},
      width: '30%'
    });

    dialogRef.componentInstance.reloadData.subscribe(() => {
      this.getCustomer(this.id);
    });
  }

  confirmDeleteVehicle(vehicle: Vehicle): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.vehicle_will_be_deleted');

    // sweet alert
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: false,
      focusCancel: true,
      confirmButtonText: this.translate.instant('operation.delete'),
      cancelButtonText: this.translate.instant('cancel'),
    })
      .then((result) => {
        if (result.isConfirmed) {
          // if user confirm delete
          this.customerService.deleteVehicle(vehicle.id)
            .subscribe({
              next: () => {
                this.getCustomer(this.id);
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.vehicle_deleted'), 'success');
              },
              error: err => {
                console.error(err);
                Swal.fire(this.translate.instant('operation.operation_failed'), '', 'error');
              }
            });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          // if user cancel delete
          Swal.fire(this.translate.instant('cancel'), '', 'error');
        }
      })
      .catch(error => {
        console.error(error);
        this.notificationService.showServerErrorMessage();
      });
  }

  handleToggleLoyaltyCard(): void {
    this.customer.hasLoyaltyCard = !this.customer.hasLoyaltyCard;

    this.customerService.save(this.customer)
      .subscribe({
        next: response => {
          this.customer = Customer.fromJson(response);
          this.notificationService.showMessage('success', this.translate.instant('operation.edit_success'));
        },
        error: err => {
          console.error(err);
          this.notificationService.editFailedMessage();
        }
      });
  }
}
