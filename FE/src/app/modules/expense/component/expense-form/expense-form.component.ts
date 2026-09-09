import {Component, Input, OnInit} from '@angular/core';
import {Expense} from "../../model/expense";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpenseType} from "../../modules/expenseType/model/expense-type";
import {ExpenseService} from "../../service/expense.service";
import {NotificationService} from "../../../application/services/notification.service";
import {Router} from "@angular/router";
import {ExpenseTypeService} from "../../modules/expenseType/service/expense-type.service";
import {TaxService} from "../../../product/modules/tax/service/tax.service";
import {TranslateService} from "@ngx-translate/core";
import {Tax} from "../../../product/modules/tax/model/tax";
import {PaymentMethod} from "../../../invoice/model/payment-method";
import {format} from "date-fns";

@Component({
  selector: 'app-expense-form',
  standalone: false,
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnInit {
  @Input()
  expense: Expense;
  form: FormGroup;
  expenseTypes: Array<ExpenseType> = [];
  isLoadingExpenseTypes = false;
  taxes: Array<Tax> = [];
  isLoadingTaxes = false;
  PaymentMethod = PaymentMethod;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly expenseService: ExpenseService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly expenseTypeService: ExpenseTypeService,
    private readonly taxService: TaxService,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      date: [null, Validators.required],
      method: [null, Validators.required],
      expenseType: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      tax: [null],
      notes: [null],
    });
  }

  ngOnInit(): void {
    if (this.expense.id) {
      this.form.controls['date'].setValue(this.expense.date ? format(this.expense.date, 'yyyy-MM-dd') : null);
      this.form.controls['method'].setValue(this.expense.method);
      this.form.controls['amount'].setValue(this.expense.amount ?? 0);
      this.form.controls['notes'].setValue(this.expense.notes ?? null);
    }

    this.loadExpenseType();
    this.loadTaxes();
  }

  loadExpenseType(): void {
    this.expenseTypes = [];
    this.isLoadingExpenseTypes = false;

    this.expenseTypeService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.expenseTypes = data.map((item: any) => ExpenseType.fromJson(item));
          this.isLoadingExpenseTypes = true;

          if (this.expense.id) {
            this.form.controls['expenseType'].setValue(this.expense.expenseType.id ?? null);
          }
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  loadTaxes(): void {
    this.taxes = [];
    this.isLoadingTaxes = false;

    this.taxService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.taxes = data.map((item: any) => Tax.fromJson(item));
          this.isLoadingTaxes = true;

          if (this.expense.tax) {
            this.form.controls['tax'].setValue(this.expense.tax.id ?? null);
          }
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      const expense = new Expense();
      expense.id = this.expense.id;
      expense.date = values.date;
      expense.method = values.method;
      expense.amount = values.amount;

      if (values.expenseType) {
        const expenseType = new ExpenseType();
        expenseType.id = values.expenseType;
        expense.expenseType = expenseType;
      }

      if (values.tax) {
        const tax = new Tax();
        tax.id = values.tax;
        expense.tax = tax;
      }

      expense.notes = values.notes;

      this.expenseService.save(expense)
        .subscribe({
          next: (savedExpense: Expense) => {
            if (savedExpense) {
              if (!this.expense.id) {
                this.notificationService.saveSuccessMessage();
              }
              else {
                this.notificationService.editSuccessMessage();
              }
              this.router.navigateByUrl('/expenses');
            }
          },
          error: err => {
            console.error(err)
            if (!this.expense.id) {
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

