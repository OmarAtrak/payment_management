import { Injectable } from '@angular/core';
import config from "../../../../../../config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Tax} from "../model/tax";

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private API_URL = config.endPoint + 'taxes';

  constructor(private http: HttpClient, public router: Router) {}

  getAll() {
    return this.http.get<Array<Tax>>(`${this.API_URL}/index`);
  }

  get(id: number) {
    return this.http.get<Tax>(`${this.API_URL}/${id}`);
  }

  save(tax: Tax) {
    if (!tax.id) {
      return this.http.post<Tax>(`${this.API_URL}/save`, tax.toJson);
    } else {
      return this.http.put<Tax>(`${this.API_URL}/update`, tax.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Tax>(`${this.API_URL}/delete/${id}`);
  }
}
