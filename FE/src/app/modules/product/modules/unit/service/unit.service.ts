import { Injectable } from '@angular/core';
import config from "../../../../../../config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Unit} from "../model/unit";

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private API_URL = config.endPoint + 'units';

  constructor(private http: HttpClient, public router: Router) {}

  getAll() {
    return this.http.get<Array<Unit>>(`${this.API_URL}/index`);
  }

  get(id: number) {
    return this.http.get<Unit>(`${this.API_URL}/${id}`);
  }

  save(unit: Unit) {
    if (!unit.id) {
      return this.http.post<Unit>(`${this.API_URL}/save`, unit.toJson);
    } else {
      return this.http.put<Unit>(`${this.API_URL}/update`, unit.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Unit>(`${this.API_URL}/delete/${id}`);
  }
}
