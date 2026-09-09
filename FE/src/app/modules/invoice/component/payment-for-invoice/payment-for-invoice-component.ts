import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Invoice} from "../../model/invoice";
import {Payment} from "../../model/payment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InvoiceService} from "../../service/invoice.service";
import {PaymentMethod} from "../../model/payment-method";
import {PaymentStatus} from "../../model/payment-status";
import {format} from "date-fns";

export interface DialogData {
  invoice: Invoice,
  payment: Payment
}

@Component({
  selector: 'app-payment-for-invoice',
  standalone: false,
  templateUrl: './payment-for-invoice-component.html',
  styleUrl: './payment-for-invoice-component.css',
})
export class PaymentForInvoiceComponent {
  form: FormGroup;
  @Output()
  reloadData = new EventEmitter<void>;
  PaymentMethod = PaymentMethod;
  PaymentStatus = PaymentStatus;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<PaymentForInvoiceComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly invoiceService: InvoiceService,
  ) {
    this.form = this.fb.group({
      date: [null, Validators.required],
      method: [null, Validators.required],
      status: [null, Validators.required],
      amount: [1, [Validators.required, Validators.min(0)]],
      notes: [null],
    });

    if (this.data?.payment?.id) {
      this.form.controls['date'].setValue(format(this.data.payment.date, 'yyyy-MM-dd'));
      this.form.controls['method'].setValue(this.data.payment.paymentMethod);
      this.form.controls['status'].setValue(this.data.payment.status);
      this.form.controls['amount'].setValue(this.data.payment.amount);
      this.form.controls['notes'].setValue(this.data.payment.notes);
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      if (!this.data?.payment?.id) {
        this.data.payment = new Payment();
      }
      const values = this.form.value;
      this.data.payment.active = true;
      this.data.payment.date = values.date;
      this.data.payment.paymentMethod = values.method;
      this.data.payment.status = values.status;
      this.data.payment.amount = values.amount;
      this.data.payment.notes = values.notes;

      this.invoiceService.savePayment(this.data.invoice.id, this.data.payment)
        .subscribe({
          next: () => {
            if (!this.data.payment.id) {
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
}
