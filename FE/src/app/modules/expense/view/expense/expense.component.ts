import {Component, OnInit} from '@angular/core';
import {Expense} from "../../model/expense";
import {ExpenseService} from "../../service/expense.service";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {Pagination} from "../../../shared/model/pagination";
import Swal from "sweetalert2";
import {capitalizeFirstLetter} from "../../../application/app.global";

@Component({
  selector: 'app-expense',
  standalone: false,
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  expenses: Array<Expense> = [];
  isLoading: boolean = false;
  pagination: Pagination = new Pagination();
  capitalizeFirstLetter = capitalizeFirstLetter;

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getExpenses();
  }

  getExpenses(): void {
    this.expenses = [];
    this.isLoading = false;

    this.expenseService.getAll(
      this.pagination.currentPage,
      this.pagination.pageSize
    ).subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.expenses = data.map((item: any) => Expense.fromJson(item));
          this.pagination.totalItems = httpResponse.totalElements;
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteExpense(expense: Expense): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.expense_will_be_deleted');

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
          this.expenseService.delete(expense.id)
            .subscribe({
              next: () => {
                this.getExpenses();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.expense_deleted'), 'success');
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

  reloadData(pagination: Pagination) {
    this.pagination = pagination;
    this.getExpenses();
  }
}
