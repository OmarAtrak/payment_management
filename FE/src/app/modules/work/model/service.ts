import {Tax} from "../../product/modules/tax/model/tax";

export class Service {
  private _id: number;
  private _code: string;
  private _name: string;
  private _description: string;
  private _descriptionHtml: string;
  private _price: number;
  private _active: boolean;
  private _tax: Tax;



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

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get descriptionHtml(): string {
    return this._descriptionHtml;
  }
  set descriptionHtml(value: string) {
    this._descriptionHtml = value;
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get tax(): Tax {
    return this._tax;
  }
  set tax(value: Tax) {
    this._tax = value;
  }

  get descriptionForPrint(): string {
    if (!this._description) return '';

    return '\n' + this.description;
  }



  get toJson(): any {
    return {
      id: this.id ? this.id : null,
      code: this.code,
      name: this.name,
      description: this.description,
      descriptionHtml: this.descriptionHtml,
      price: this.price,
      active: this.active ?? true,
      tax: this.tax ? { id: this.tax.id } : null
    }
  }

  static fromJson(json: any): Service {
    const service: Service = new Service();
    service.id = json.id;
    service.code = json.code;
    service.name = json.name;
    service.description = json.description;
    service.descriptionHtml = json.descriptionHtml;
    service.price = json.price;
    service.active = json.active;

    if (json.tax) {
      service.tax = Tax.fromJson(json.tax);
    }

    return service;
  }
}
