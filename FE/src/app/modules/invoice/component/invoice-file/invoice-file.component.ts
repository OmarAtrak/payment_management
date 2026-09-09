import {Component, Inject, Input} from '@angular/core';
import {Invoice} from "../../model/invoice";
import {Company} from "../../../company/model/company";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

export interface DialogData {
  invoice: Invoice,
  company: Company
}

@Component({
  selector: 'app-invoice-file',
  standalone: false,
  templateUrl: './invoice-file.component.html',
  styleUrl: './invoice-file.component.css',
})
export class InvoiceFileComponent {
  @Input()
  invoice: Invoice;
  @Input()
  company: Company;
  capitalizeFirstLetter = capitalizeFirstLetter;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }


  constructor(
    private readonly translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.invoice = data.invoice;
    this.company = data.company;
  }
}
