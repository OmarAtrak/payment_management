import { Injectable } from '@angular/core';
import config from "../../../../../../config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ExpenseType} from "../model/expense-type";

@Injectable({
  providedIn: 'root',
})
export class ExpenseTypeService {
  private API_URL = config.endPoint + 'expense/types';

  constructor(private http: HttpClient, public router: Router) {}

  getAll() {
    return this.http.get<Array<ExpenseType>>(`${this.API_URL}/index`);
  }

  get(id: number) {
    return this.http.get<ExpenseType>(`${this.API_URL}/${id}`);
  }

  save(expenseType: ExpenseType) {
    if (!expenseType.id) {
      return this.http.post<ExpenseType>(`${this.API_URL}/save`, expenseType.toJson);
    } else {
      return this.http.put<ExpenseType>(`${this.API_URL}/update`, expenseType.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<ExpenseType>(`${this.API_URL}/delete/${id}`);
  }
}
