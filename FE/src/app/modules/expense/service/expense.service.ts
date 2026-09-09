import { Injectable } from '@angular/core';
import config from "../../../../config";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {Expense} from "../model/expense";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private API_URL = config.endPoint + 'expenses';

  constructor(private http: HttpClient, public router: Router) {}

  getAll(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size);

    return this.http.get<Array<Expense>>(`${this.API_URL}/index`, { params: params });
  }

  get(id: number) {
    return this.http.get<Expense>(`${this.API_URL}/${id}`);
  }

  save(expenseType: Expense) {
    if (!expenseType.id) {
      return this.http.post<Expense>(`${this.API_URL}/save`, expenseType.toJson);
    } else {
      return this.http.put<Expense>(`${this.API_URL}/update`, expenseType.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Expense>(`${this.API_URL}/delete/${id}`);
  }
}
