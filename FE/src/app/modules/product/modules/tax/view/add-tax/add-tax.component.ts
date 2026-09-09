import { Component } from '@angular/core';
import {Tax} from "../../model/tax";

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrl: './add-tax.component.css',
  standalone: false
})
export class AddTaxComponent {
  tax: Tax = new Tax();
}
