import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Invoice} from "../../model/invoice";
import {Customer} from "../../../customer/model/customer";
import {InvoiceService} from "../../service/invoice.service";
import {NotificationService} from "../../../application/services/notification.service";
import {Router} from "@angular/router";
import {CustomerService} from "../../../customer/service/customer.service";
import {format} from "date-fns";
import {InvoiceStatus} from "../../model/invoice-status";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-invoice-form',
  standalone: false,
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
})
export class InvoiceFormComponent implements OnInit {
  @Input()
  invoice: Invoice;
  form: FormGroup;

  customers: Array<Customer> = [];
  isLoadingCustomers = false;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly customerService: CustomerService,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      date: [null, Validators.required],
      customer: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.invoice.id) {
      this.form.controls['date'].setValue(this.invoice.date ? format(this.invoice.date, 'yyyy-MM-dd') : null);
      this.form.controls['customer'].setValue(this.invoice.customer ? this.invoice.customer.id : null);
    }

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customers = [];
    this.isLoadingCustomers = false;

    this.customerService.getAll(1, 2000).subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.customers = data.map((c: any) => Customer.fromJson(c));
          if (this.invoice.id) {
            this.form.controls['customer'].setValue(this.invoice.customer.id ?? null);
          }
          this.isLoadingCustomers = true;
        }
      },
      error: () => {
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.invoice.date = values.date;
      if (!this.invoice.id) {
        this.invoice.status = InvoiceStatus.DRAFT;
      }

      const customer = new Customer();
      customer.id = values.customer;
      this.invoice.customer = customer;

      this.invoiceService.save(this.invoice)
        .subscribe({
          next: (savedInvoice: Invoice) => {
            if (savedInvoice) {
              if (!this.invoice.id) {
                this.notificationService.saveSuccessMessage();
              }
              else {
                this.notificationService.editSuccessMessage();
              }
              this.router.navigateByUrl(`/invoices/details/${savedInvoice.id}`);
            }
          },
          error: err => {
            console.error(err)
            if (!this.invoice.id) {
              this.notificationService.saveFailedMessage();
            }
            else {
              this.notificationService.editFailedMessage();
            }
          }
        });
    }
  }
}
