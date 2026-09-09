import { Injectable } from '@angular/core';
import config from "../../../../config";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Service} from "../model/service";
import {TopService} from "../model/top-service";

@Injectable({
  providedIn: 'root',
})
export class WorkService {
  private API_URL = config.endPoint + 'services';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size);

    return this.http.get<Array<Service>>(`${this.API_URL}/index`, { params: params });
  }

  get(id: number) {
    return this.http.get<Service>(`${this.API_URL}/${id}`);
  }

  save(service: Service) {
    if (!service.id) {
      return this.http.post<Service>(`${this.API_URL}/save`, service.toJson);
    } else {
      return this.http.put<Service>(`${this.API_URL}/update`, service.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Service>(`${this.API_URL}/delete/${id}`);
  }

  getTopRequested(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size);

    return this.http.get<Array<TopService>>(`${this.API_URL}/top-requested`, { params: params });
  }
}
