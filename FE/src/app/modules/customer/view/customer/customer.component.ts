import {Component, OnInit} from '@angular/core';
import {Customer} from "../../model/customer";
import {Pagination} from "../../../shared/model/pagination";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {CustomerService} from "../../service/customer.service";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  customers: Array<Customer> = [];
  isLoading: boolean = false;
  pagination: Pagination = new Pagination();
  capitalizeFirstLetter = capitalizeFirstLetter;

  constructor(
    private readonly customerService: CustomerService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customers = [];
    this.isLoading = false;

    this.customerService.getAll(
      this.pagination.currentPage,
      this.pagination.pageSize
    ).subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.customers = data.map((item: any) => Customer.fromJson(item));
          this.pagination.totalItems = httpResponse.totalElements;
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteCustomer(customer: Customer): void {
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
          this.customerService.delete(customer.id)
            .subscribe({
              next: () => {
                this.getCustomers();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.customer_deleted'), 'success');
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

  reloadData(pagination: Pagination) {
    this.pagination = pagination;
    this.getCustomers();
  }
}
