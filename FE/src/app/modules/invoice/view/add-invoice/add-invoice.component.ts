import { Component } from '@angular/core';
import {Invoice} from "../../model/invoice";

@Component({
  selector: 'app-add-invoice.component',
  standalone: false,
  templateUrl: './add-invoice.component.html',
  styleUrl: './add-invoice.component.css',
})
export class AddInvoiceComponent {
  invoice = new Invoice();
}
