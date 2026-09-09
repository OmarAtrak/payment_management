import {Component, Input} from '@angular/core';
import {Tax} from "../../model/tax";
import {TaxService} from "../../service/tax.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-tax-form',
  templateUrl: './tax-form.component.html',
  styleUrl: './tax-form.component.css',
  standalone: false
})
export class TaxFormComponent {
  @Input()
  tax: Tax;
  form: FormGroup;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }

  constructor(
    private readonly taxService: TaxService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      rate: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.tax.id) {
      this.form.controls['name'].setValue(this.tax.name);
      this.form.controls['rate'].setValue(this.tax.rate);
    }
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.tax.name = values.name;
      this.tax.rate = values.rate;

      this.taxService.save(this.tax).subscribe({
        next: (savedTax: Tax) => {
          if (savedTax) {
            if (!this.tax.id) {
              this.notificationService.saveSuccessMessage();
            }
            else {
              this.notificationService.editSuccessMessage();
            }
            this.router.navigateByUrl('/taxes');
          }
        },
        error: err => {
          console.error(err)
          if (!this.tax.id) {
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
