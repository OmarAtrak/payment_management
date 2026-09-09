import { Component } from '@angular/core';
import {ExpenseType} from "../../model/expense-type";
import {ExpenseTypeService} from "../../service/expense-type.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-expense-type.component',
  standalone: false,
  templateUrl: './edit-expense-type.component.html',
  styleUrl: './edit-expense-type.component.css',
})
export class EditExpenseTypeComponent {
  currentExpenseType: ExpenseType = new ExpenseType();
  isLoading: boolean = false;
  id: number;


  constructor(
    private readonly expenseTypeService: ExpenseTypeService,
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

    // get expense type by id
    this.getExpenseType(this.id);
  }

  getExpenseType(id: number): void {
    this.expenseTypeService.get(id)
      .subscribe({
        next: response => {
          this.currentExpenseType = ExpenseType.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
