import {Component, OnInit} from '@angular/core';
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-customer',
  standalone: false,
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit {
  currentCustomer: Customer = new Customer();
  isLoading: boolean = false;
  id: number;

  constructor(
    private readonly customerService: CustomerService,
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

    // get customer by id
    this.getCustomer(this.id);
  }

  getCustomer(id: number): void {
    this.customerService.get(id)
      .subscribe({
        next: response => {
          this.currentCustomer = Customer.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
