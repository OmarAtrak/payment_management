import {Component, OnInit} from '@angular/core';
import {Tax} from "../../model/tax";
import {TaxService} from "../../service/tax.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css',
  standalone: false,
})
export class TaxComponent implements OnInit {
  taxes: Array<Tax> = [];
  isLoading: boolean = false;


  constructor(
    private readonly taxService: TaxService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadTaxes();
  }

  loadTaxes(): void {
    this.taxes = [];
    this.isLoading = false;

    this.taxService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.taxes = data.map((item: any) => Tax.fromJson(item));
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err)
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteTax(tax: Tax): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.tax_will_be_deleted');

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
          this.taxService.delete(tax.id)
            .subscribe({
              next: () => {
                this.loadTaxes();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.tax_deleted'), 'success');
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
}
