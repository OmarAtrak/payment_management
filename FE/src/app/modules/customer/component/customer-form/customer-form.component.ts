import {Component, Input} from '@angular/core';
import {Customer} from "../../model/customer";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../service/customer.service";
import {NotificationService} from "../../../application/services/notification.service";
import {Router} from "@angular/router";
import {Address} from "../../../shared/model/address";
import {Contact} from "../../../shared/model/contact";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-customer-form',
  standalone: false,
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent {
  @Input()
  customer: Customer;
  form: FormGroup;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly customerService: CustomerService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],

      address: [null, Validators.required],
      city: [null, Validators.required],

      phoneNumber: [null, Validators.required],
      fax: [null],
      email: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.customer.id) {
      this.form.controls['name'].setValue(this.customer.name);

      this.form.controls['address'].setValue(this.customer.address.address ?? null);
      this.form.controls['city'].setValue(this.customer.address.city ?? null);

      this.form.controls['phoneNumber'].setValue(this.customer.contact.phoneNumber ?? null);
      this.form.controls['fax'].setValue(this.customer.contact.fax ?? null);
      this.form.controls['email'].setValue(this.customer.contact.email ?? null);
    }
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.customer.name = values.name;

      if (!this.customer.address) {
        this.customer.address = new Address();
      }
      this.customer.address.address = values.address;
      this.customer.address.city = values.city;

      if (!this.customer.contact) {
        this.customer.contact = new Contact();
      }
      this.customer.contact.phoneNumber = values.phoneNumber;
      this.customer.contact.fax = values.fax;
      this.customer.contact.email = values.email;

      this.customerService.save(this.customer)
        .subscribe({
          next: (savedCustomer: Customer) => {
            if (savedCustomer) {
              if (!this.customer.id) {
                this.notificationService.saveSuccessMessage();
              }
              else {
                this.notificationService.editSuccessMessage();
              }
              this.router.navigateByUrl('/customers');
            }
          },
          error: err => {
            console.error(err)
            if (!this.customer.id) {
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
