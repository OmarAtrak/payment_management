import {Component, OnInit} from '@angular/core';
import {Invoice} from "../../model/invoice";
import {InvoiceService} from "../../service/invoice.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-invoice.component',
  standalone: false,
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.css',
})
export class EditInvoiceComponent implements OnInit {
  currentInvoice: Invoice = new Invoice();
  isLoading: boolean = false;
  id: number;

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
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
  }

  getInvoice(id: number): void {
    this.invoiceService.get(id)
      .subscribe({
        next: response => {
          this.currentInvoice = Invoice.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
