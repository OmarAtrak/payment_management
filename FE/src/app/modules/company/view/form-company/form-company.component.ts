import {Component, OnInit} from '@angular/core';
import {Company} from "../../model/company";
import {CompanyService} from "../../service/company.service";
import {NotificationService} from "../../../application/services/notification.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-form-company',
  standalone: false,
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.css',
})
export class FormCompanyComponent implements OnInit {
  company: Company = new Company();
  form: FormGroup;
  enabledForm: boolean = false;
  isLoading: boolean = false;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }

  constructor(
    private readonly companyService: CompanyService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      rc: [null, [Validators.required]],
      ice: [null, [Validators.required]],
      ifu: [null, [Validators.required]],
      cnss: [null, [Validators.required]],
      tp: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      siteWeb: [null],
    });

    this.form.disable();
  }

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    this.companyService.get(1).subscribe({
      next: (company: Company) => {
        this.company = Company.fromJson(company);

        this.form.patchValue({
          name: company.name,
          rc: company.rc,
          ice: company.ice,
          ifu: company.ifu,
          cnss: company.cnss,
          tp: company.tp,
          email: company.contact?.email,
          phone: company.contact?.phoneNumber,
          siteWeb: company?.siteWeb,
        });

        this.isLoading = true;
      },
      error: () => {
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  toggleForm() {
    this.enabledForm = !this.enabledForm;

    if (this.enabledForm) {
      this.form.enable();
    } else {
      this.form.disable();
      // Reset form values to original company data
      this.form.patchValue({
        name: this.company.name,
        rc: this.company.rc,
        ice: this.company.ice,
        ifu: this.company.ifu,
        cnss: this.company.cnss,
        tp: this.company.tp,
        email: this.company.contact?.email,
        phone: this.company.contact?.phoneNumber,
        siteWeb: this.company?.siteWeb,
      });
      // Clear validation errors
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  saveCompany() {
    if (this.form.valid) {
      this.company.name = this.form.value.name;
      this.company.rc = this.form.value.rc;
      this.company.ice = this.form.value.ice;
      this.company.ifu = this.form.value.ifu;
      this.company.cnss = this.form.value.cnss;
      this.company.tp = this.form.value.tp;
      if (this.company.contact) {
        this.company.contact.email = this.form.value.email;
        this.company.contact.phoneNumber = this.form.value.phone;
      }
      this.company.siteWeb = this.form.value.siteWeb;

      this.companyService.save(this.company).subscribe({
        next: () => {
          this.notificationService.editSuccessMessage()
          this.enabledForm = false;
          this.form.disable()
        },
        error: () => {
          this.notificationService.editFailedMessage();
        }
      });
    }
  }
}
