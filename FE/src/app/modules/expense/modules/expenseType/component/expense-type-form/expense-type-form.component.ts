import {Component, Input} from '@angular/core';
import {ExpenseType} from "../../model/expense-type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpenseTypeService} from "../../service/expense-type.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-expense-type-form',
  standalone: false,
  templateUrl: './expense-type-form.component.html',
  styleUrl: './expense-type-form.component.css',
})
export class ExpenseTypeFormComponent {
  @Input()
  expenseType: ExpenseType;
  form: FormGroup;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly expenseTypeService: ExpenseTypeService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.expenseType.id) {
      this.form.controls['name'].setValue(this.expenseType.name);
    }
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.expenseType.name = values.name;

      this.expenseTypeService.save(this.expenseType).subscribe({
        next: (savedExpenseType: ExpenseType) => {
          if (savedExpenseType) {
            if (!this.expenseType.id) {
              this.notificationService.saveSuccessMessage();
            }
            else {
              this.notificationService.editSuccessMessage();
            }
            this.router.navigateByUrl('/expense-types');
          }
        },
        error: err => {
          console.error(err)
          if (!this.expenseType.id) {
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
