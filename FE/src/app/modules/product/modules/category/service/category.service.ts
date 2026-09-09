import { Injectable } from '@angular/core';
import config from "../../../../../../config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Category} from "../model/category";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private API_URL = config.endPoint + 'product/categories';

  constructor(private http: HttpClient, public router: Router) {}

  getAll() {
    return this.http.get<Array<Category>>(`${this.API_URL}/index`);
  }

  get(id: number) {
    return this.http.get<Category>(`${this.API_URL}/${id}`);
  }

  save(category: Category) {
    if (!category.id) {
      return this.http.post<Category>(`${this.API_URL}/save`, category.toJson);
    } else {
      return this.http.put<Category>(`${this.API_URL}/update`, category.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Category>(`${this.API_URL}/delete/${id}`);
  }
}
