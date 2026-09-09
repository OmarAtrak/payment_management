import {Component, OnInit} from '@angular/core';
import {Expense} from "../../model/expense";
import {ExpenseService} from "../../service/expense.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-expense',
  standalone: false,
  templateUrl: './edit-expense.component.html',
  styleUrl: './edit-expense.component.css'
})
export class EditExpenseComponent implements OnInit {
  currentExpense: Expense = new Expense();
  isLoading: boolean = false;
  id: number;

  constructor(
    private readonly expenseService: ExpenseService,
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

    // get expense by id
    this.getExpense(this.id);
  }

  getExpense(id: number): void {
    this.expenseService.get(id)
      .subscribe({
        next: response => {
          this.currentExpense = Expense.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
