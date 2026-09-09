import {Address} from "../../shared/model/address";
import {Contact} from "../../shared/model/contact";
import { Vehicle } from "./vehicle";

export class Customer {
  private _id: number;
  private _code: string;
  private _name: string;
  private _active: boolean;
  private _address: Address;
  private _contact: Contact;
  private _vehicles: Array<Vehicle> = [];
  private _hasLoyaltyCard: boolean;



  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get code(): string {
    return this._code;
  }
  set code(value: string) {
    this._code = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get address(): Address {
    return this._address;
  }
  set address(value: Address) {
    this._address = value;
  }

  get contact(): Contact {
    return this._contact;
  }
  set contact(value: Contact) {
    this._contact = value;
  }

  get vehicles(): Array<Vehicle> {
    return this._vehicles;
  }
  set vehicles(value: Array<Vehicle>) {
    this._vehicles = value;
  }

  get hasLoyaltyCard(): boolean {
    return this._hasLoyaltyCard;
  }
  set hasLoyaltyCard(value: boolean) {
    this._hasLoyaltyCard = value;
  }

  get vehiclesToJson(): any {
    return this.vehicles
      ? this.vehicles.map(v => v.toJson)
      : [];
  }



  get toJson(): any {
    return {
      id: this.id ?? null,
      code: this.code,
      name: this.name,
      active: this.active ?? true,
      address: this.address ? this.address.toJson : null,
      contact: this.contact ? this.contact.toJson : null,
      vehicles: this.vehiclesToJson,
      hasLoyaltyCard: this.hasLoyaltyCard ?? false
    };
  }

  static fromJson(json: any): Customer {
    const customer: Customer = new Customer();
    customer.id = json.id;
    customer.code = json.code;
    customer.name = json.name;
    customer.active = json.active;

    if (json.address) {
      customer.address = Address.fromJson(json.address);
    }

    if (json.contact) {
      customer.contact = Contact.fromJson(json.contact);
    }

    customer.vehicles = [];
    if (json.vehicles) {
      customer.vehicles = json.vehicles
        .map((vehicle: any) => Vehicle.fromJson(vehicle))
        .filter((vehicle: Vehicle) => vehicle.active);
    }

    customer.hasLoyaltyCard = json.hasLoyaltyCard;

    return customer;
  }
}
