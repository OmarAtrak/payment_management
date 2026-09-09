import { Component } from '@angular/core';
import {ExpenseType} from "../../model/expense-type";

@Component({
  selector: 'app-add-expense-type.component',
  standalone: false,
  templateUrl: './add-expense-type.component.html',
  styleUrl: './add-expense-type.component.css',
})
export class AddExpenseTypeComponent {
  expenseType: ExpenseType = new ExpenseType();
}
