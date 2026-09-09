import { Component } from '@angular/core';
import {Customer} from "../../model/customer";

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  customer: Customer = new Customer();
}
