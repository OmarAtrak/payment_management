import { Component } from '@angular/core';
import {Expense} from "../../model/expense";

@Component({
  selector: 'app-add-expense',
  standalone: false,
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {
  expense: Expense = new Expense();
}
