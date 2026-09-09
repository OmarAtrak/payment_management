import {Component, OnInit} from '@angular/core';
import {Invoice} from "../../model/invoice";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {InvoiceService} from "../../service/invoice.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";
import {InvoiceStatus} from "../../model/invoice-status";
import {MatDialog} from "@angular/material/dialog";
import {ProductForInvoiceComponent} from "../../component/product-for-invoice/product-for-invoice.component";
import {ServiceForInvoiceComponent} from "../../component/service-for-invoice/service-for-invoice.component";
import {ProductItem} from "../../model/product-item";
import {ServiceItem} from "../../model/service-item";
import {CompanyService} from "../../../company/service/company.service";
import {Company} from "../../../company/model/company";
import {Payment} from "../../model/payment";
import {PaymentForInvoiceComponent} from "../../component/payment-for-invoice/payment-for-invoice-component";

@Component({
  selector: 'app-details-invoice.component',
  standalone: false,
  templateUrl: './details-invoice.component.html',
  styleUrl: './details-invoice.component.css',
})
export class DetailsInvoiceComponent implements OnInit {
  invoice: Invoice = new Invoice();
  isLoadingInvoice: boolean = false;
  company: Company = new Company();
  isLoadingCompany: boolean = false;
  id: number;
  capitalizeFirstLetter = capitalizeFirstLetter;
  invoiceStatus = InvoiceStatus;
  showDiscountColumn: boolean = false;
  discountValue: number = 0;

  get isLoading(): boolean {
    return this.isLoadingInvoice && this.isLoadingCompany;
  }

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly companyService: CompanyService,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe((params) => {
        const id = params.get('id');
        if (id != undefined) {
          this.id = Number(id);
        }
      });

    // get invoice by id
    this.getInvoice(this.id);

    this.getCompanyData();
  }

  getInvoice(id: number): void {
    this.invoiceService.get(id)
      .subscribe({
        next: response => {
          this.invoice = Invoice.fromJson(response);
          this.discountValue = this.invoice.discount || 0;
          this.isLoadingInvoice = true;
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

  showDialogConfirmDelete(): void {
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
          this.invoiceService.delete(this.invoice.id)
            .subscribe({
              next: () => {
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.invoice_deleted'), 'success')
                  .then(() => {
                    this.router.navigateByUrl('/invoices');
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

  openProductItemDialog(productItem?: ProductItem): void {
    const dialogRef = this.dialog.open(ProductForInvoiceComponent, {
      data: {
        invoice: this.invoice,
        productItem: productItem ? productItem : null,
      },
      position: {top: '100px'},
      width: '30%'
    });

    dialogRef.componentInstance.reloadData.subscribe(() => {
      this.getInvoice(this.id);
    });
  }
  showDialogConfirmDeleteProductItem(productItem: ProductItem): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.product_item_will_be_deleted');

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
          this.invoiceService.deleteProductItem(productItem.id)
            .subscribe({
              next: () => {
                this.getInvoice(this.id);
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.product_item_deleted'), 'success');
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

  openServiceItemDialog(serviceItem?: ServiceItem): void {
    const dialogRef = this.dialog.open(ServiceForInvoiceComponent, {
      data: {
        invoice: this.invoice,
        serviceItem: serviceItem ? serviceItem : null,
      },
      position: {top: '100px'},
      width: '30%'
    });

    dialogRef.componentInstance.reloadData.subscribe(() => {
      this.getInvoice(this.id);
    });
  }
  showDialogConfirmDeleteServiceItem(serviceItem: ServiceItem): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.service_item_will_be_deleted');

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
          this.invoiceService.deleteServiceItem(serviceItem.id)
            .subscribe({
              next: () => {
                this.getInvoice(this.id);
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.service_item_deleted'), 'success');
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

  openPaymentDialog(payment?: Payment): void {
    const dialogRef = this.dialog.open(PaymentForInvoiceComponent, {
      data: {
        invoice: this.invoice,
        payment: payment ? payment : null,
      },
      position: {top: '100px'},
      width: '30%'
    });

    dialogRef.componentInstance.reloadData.subscribe(() => {
      this.getInvoice(this.id);
    });
  }
  showDialogConfirmDeletePayment(payment: Payment): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.payment_will_be_deleted');

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
          this.invoiceService.deletePayment(payment.id)
            .subscribe({
              next: () => {
                this.getInvoice(this.id);
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.payment_deleted'), 'success');
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

  changeStatus(status: InvoiceStatus): void {
    this.invoice.status = status;

    this.invoiceService.save(this.invoice)
      .subscribe({
        next: (response: Invoice) => {
          if (response) {
            this.notificationService.editSuccessMessage();
          }
        },
        error: err => {
          console.error(err);
          this.notificationService.editFailedMessage();
        }
      });
  }

  printPdf(): void {
    this.invoiceService.generateInvoicePDF(this.invoice, this.company);
  }

  printBon(): void {
    this.invoiceService.generateInvoiceBon(this.invoice, this.company);
  }

  generatePaymentPdf(payment: Payment): void {
    this.invoiceService.generatePaymentPdf(this.invoice, this.company, payment);
  }

  toggleShowDiscountColumn(): void {
    this.discountValue = this.invoice.discount || 0;
    this.showDiscountColumn = !this.showDiscountColumn;
  }

  toggleDiscountColumn(): void {
    this.invoice.discount = this.discountValue;
    this.showDiscountColumn = false;

    this.invoiceService.save(this.invoice)
      .subscribe({
        next: (response: Invoice) => {
          if (response) {
            this.notificationService.editSuccessMessage();
          }
        },
        error: err => {
          console.error(err);
          this.notificationService.editFailedMessage();
        }
      });
  }
}
