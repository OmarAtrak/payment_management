import { Component } from '@angular/core';
import {ExpenseType} from "../../model/expense-type";
import {capitalizeFirstLetter} from "../../../../../application/app.global";
import {ExpenseTypeService} from "../../service/expense-type.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-expense-type.component',
  standalone: false,
  templateUrl: './expense-type.component.html',
  styleUrl: './expense-type.component.css',
})
export class ExpenseTypeComponent {
  expenseTypes: Array<ExpenseType> = [];
  isLoading: boolean = false;
  capitalizeFirstLetter = capitalizeFirstLetter;


  constructor(
    private readonly expenseTypeService: ExpenseTypeService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadExpenseTypes();
  }

  loadExpenseTypes(): void {
    this.expenseTypes = [];
    this.isLoading = false;

    this.expenseTypeService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.expenseTypes = data.map((item: any) => ExpenseType.fromJson(item));
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err)
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteExpenseType(expenseType: ExpenseType): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.expense_type_will_be_deleted');

    // sweet alert
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: false,
      focusCancel: true,
      confirmButtonText: this.translate.instant('operation.delete'),
      cancelButtonText: this.translate.instant('cancel'),
    })
      .then((result) => {
        if (result.isConfirmed) {
          // if user confirm delete
          this.expenseTypeService.delete(expenseType.id)
            .subscribe({
              next: () => {
                this.loadExpenseTypes();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.expense_type_deleted'), 'success');
              },
              error: err => {
                console.error(err);
                Swal.fire(this.translate.instant('operation.operation_failed'), '', 'error');
              }
            });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          // if user cancel delete
          Swal.fire(this.translate.instant('cancel'), '', 'error');
        }
      })
      .catch(error => {
        console.error(error);
        this.notificationService.showServerErrorMessage();
      });
  }
}
