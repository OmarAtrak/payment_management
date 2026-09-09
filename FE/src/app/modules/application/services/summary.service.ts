import { Injectable } from '@angular/core';
import config from "../../../../config";
import {HttpClient} from "@angular/common/http";
import {SummaryBalance} from "../model/summary-balance";

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private API_URL = config.endPoint + 'summary';

  constructor(private http: HttpClient) {}

  getBalance() {
    return this.http.get<SummaryBalance>(`${this.API_URL}/balance`);
  }

  getBalanceByPeriod(startDate: string, endDate: string) {
    return this.http.get<SummaryBalance>(`${this.API_URL}/balance`, {
      params: {
        startDate,
        endDate
      }
    });
  }
}
