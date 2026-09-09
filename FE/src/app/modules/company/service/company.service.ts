import { Injectable } from '@angular/core';
import config from "../../../../config";
import {HttpClient} from "@angular/common/http";
import {Company} from "../model/company";

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private API_URL = config.endPoint + 'company';

  constructor(private http: HttpClient) {}

  get(id: number) {
    return this.http.get<Company>(`${this.API_URL}/${id}`);
  }

  save(company: Company) {
    if (!company.id) {
      return this.http.post<Company>(`${this.API_URL}/save`, company.toJson);
    } else {
      return this.http.put<Company>(`${this.API_URL}/update`, company.toJson);
    }
  }
}
