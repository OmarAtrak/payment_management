import {Component, OnInit} from '@angular/core';
import {Invoice} from "../../model/invoice";
import {Pagination} from "../../../shared/model/pagination";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {InvoiceService} from "../../service/invoice.service";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";
import {InvoiceStatus} from "../../model/invoice-status";
import {MatDialog} from "@angular/material/dialog";
import {InvoiceFileComponent} from "../../component/invoice-file/invoice-file.component";
import {Company} from "../../../company/model/company";
import {CompanyService} from "../../../company/service/company.service";

@Component({
  selector: 'app-invoice.component',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  invoices: Array<Invoice> = [];
  isLoadingInvoices: boolean = false;
  pagination: Pagination = new Pagination();
  capitalizeFirstLetter = capitalizeFirstLetter;
  invoiceStatus = InvoiceStatus;
  company: Company = new Company();
  isLoadingCompany: boolean = false;

  get isLoading(): boolean {
    return this.isLoadingInvoices && this.isLoadingCompany;
  }

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog,
    private readonly companyService: CompanyService,
  ) {
    this.pagination.sortField = 'date';
    this.pagination.sortDirection = 'desc';
  }

  ngOnInit() {
    this.getInvoices();
    this.getCompanyData();
  }

  getInvoices(): void {
    this.invoices = [];
    this.isLoadingInvoices = false;

    this.invoiceService.getAll(
      this.pagination.currentPage,
      this.pagination.pageSize,
      this.pagination.sortField,
      this.pagination.sortDirection,
    ).subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.invoices = data.map((item: any) => Invoice.fromJson(item));
          this.pagination.totalItems = httpResponse.totalElements;
          this.isLoadingInvoices = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  getCompanyData(): void {
    this.companyService.get(1)
      .subscribe({
        next: response => {
          this.company = Company.fromJson(response);
          this.isLoadingCompany = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  confirmDeleteInvoice(invoice: Invoice): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.invoice_will_be_deleted');

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
          this.invoiceService.delete(invoice.id)
            .subscribe({
              next: () => {
                this.getInvoices();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.invoice_deleted'), 'success');
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
    this.getInvoices();
  }

  openFile(invoice: Invoice): void {
    this.dialog.open(InvoiceFileComponent, {
      data: {
        invoice: invoice,
        company: this.company,
      },
      position: {top: '100px'},
      width: '90%',
      height: '600px'
    });
  }
}
