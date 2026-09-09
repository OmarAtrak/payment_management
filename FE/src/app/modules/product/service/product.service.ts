import { Injectable } from '@angular/core';
import config from "../../../../config";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Product} from "../model/product";
import {ProductPage} from "../model/product-page";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL = config.endPoint + 'products';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size);

    return this.http.get<ProductPage>(`${this.API_URL}/index`, { params: params });
  }

  get(id: number) {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  save(product: Product) {
    if (!product.id) {
      return this.http.post<Product>(`${this.API_URL}/save`, product.toJson);
    } else {
      return this.http.put<Product>(`${this.API_URL}/update`, product.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Product>(`${this.API_URL}/delete/${id}`);
  }
}
