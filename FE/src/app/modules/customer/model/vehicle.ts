import {Customer} from "./customer";

export class Vehicle {
  private _id: number;
  private _model: string;
  private _vin: string;
  private _manufactureYear: number;
  private _registrationNumber: string;
  private _active: boolean;
  private _color: string;
  private _customer: Customer;



  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
  }

  get manufactureYear(): number {
    return this._manufactureYear;
  }
  set manufactureYear(value: number) {
    this._manufactureYear = value;
  }

  get vin(): string {
    return this._vin;
  }
  set vin(value: string) {
    this._vin = value;
  }

  get registrationNumber(): string {
    return this._registrationNumber;
  }
  set registrationNumber(value: string) {
    this._registrationNumber = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
  }

  get customer(): Customer {
    return this._customer;
  }
  set customer(value: Customer) {
    this._customer = value;
  }



  get toJson(): any {
    return {
      id: this.id ?? null,
      model: this.model,
      vin: this.vin,
      manufactureYear: this.manufactureYear,
      registrationNumber: this.registrationNumber,
      active: this.active ?? true,
      color: this.color,
      customer: this.customer ? { id: this.customer.id } : null
    };
  }

  static fromJson(json: any): Vehicle {
    const vehicle: Vehicle = new Vehicle();
    vehicle.id = json.id;
    vehicle.model = json.model;
    vehicle.vin = json.vin;
    vehicle.manufactureYear = json.manufactureYear;
    vehicle.registrationNumber = json.registrationNumber;
    vehicle.active = json.active;
    vehicle.color = json.color;
    return vehicle;
  }
}
