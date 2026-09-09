import { Injectable } from '@angular/core';
import config from "../../../../config";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Customer} from "../model/customer";
import {Vehicle} from "../model/vehicle";
import {TopCustomer} from "../model/top-customer";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private API_URL = config.endPoint + 'customers';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size);

    return this.http.get<Array<Customer>>(`${this.API_URL}/index`, { params: params });
  }

  get(id: number) {
    return this.http.get<Customer>(`${this.API_URL}/${id}`);
  }

  save(customer: Customer) {
    if (!customer.id) {
      return this.http.post<Customer>(`${this.API_URL}/save`, customer.toJson);
    } else {
      return this.http.put<Customer>(`${this.API_URL}/update`, customer.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Customer>(`${this.API_URL}/delete/${id}`);
  }

  saveVehicle(vehicle: Vehicle) {
    if (!vehicle.id) {
      return this.http.post<Vehicle>(`${config.endPoint}vehicles/save`, vehicle.toJson);
    } else {
      return this.http.put<Vehicle>(`${config.endPoint}vehicles/update`, vehicle.toJson);
    }
  }

  deleteVehicle(id: number) {
    return this.http.delete<Customer>(`${config.endPoint}vehicles/delete/${id}`);
  }


  getTopRequestedCustomers(page: number, size: number) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size);

    return this.http.get<Array<TopCustomer>>(`${this.API_URL}/top-customers`, { params: params });
  }
}
