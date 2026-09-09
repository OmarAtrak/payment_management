import {Service} from "../../work/model/service";
import {Vehicle} from "../../customer/model/vehicle";
import {Tax} from "../../product/modules/tax/model/tax";

export class ServiceItem {
  private _id: number;
  private _active: boolean;
  private _service: Service;
  private _discount: number;
  private _price: number;
  private _priceTTC: number;
  private _ranking: number;
  private _vehicle: Vehicle;
  private _tax: Tax;



  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get service(): Service {
    return this._service;
  }
  set service(value: Service) {
    this._service = value;
  }

  get discount(): number {
    return this._discount;
  }
  set discount(value: number) {
    this._discount = value;
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  get priceTTC(): number {
    return this._priceTTC;
  }
  set priceTTC(value: number) {
    this._priceTTC = value;
  }

  get ranking(): number {
    return this._ranking;
  }
  set ranking(value: number) {
    this._ranking = value;
  }

  get vehicle(): Vehicle {
    return this._vehicle;
  }
  set vehicle(value: Vehicle) {
    this._vehicle = value;
  }

  get tax(): Tax {
    return this._tax;
  }
  set tax(value: Tax) {
    this._tax = value;
  }

  get priceTVA(): number {
    if (this.tax) {
      return this.price * this.tax.rate;
    }
    return 0;
  }



  get toJson() {
    return {
      id: this.id ?? null,
      active: this.active ?? true,
      service: this.service ? { id: this.service.id } : null,
      discount: this.discount,
      price: this.price,
      ranking: this.ranking ?? 0,
      vehicle: this.vehicle ? { id: this.vehicle.id } : null,
      tax: this.tax ? { id: this.tax.id } : null,
      priceTtc: this.priceTTC,
    }
  }

  static fromJson(json: any): ServiceItem {
    const serviceItem = new ServiceItem();
    serviceItem.id = json.id;
    serviceItem.active = json.active;
    serviceItem.discount = json.discount;
    serviceItem.price = json.price;
    serviceItem.ranking = json.ranking;
    serviceItem.priceTTC = json.priceTtc;

    if (json.service) {
      serviceItem.service = Service.fromJson(json.service);
    }

    if (json.vehicle) {
      serviceItem.vehicle = Vehicle.fromJson(json.vehicle);
    }

    if (json.tax) {
      serviceItem.tax = Tax.fromJson(json.tax);
    }

    return serviceItem;
  }
}
