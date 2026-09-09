import {Tax} from "../modules/tax/model/tax";
import {Unit} from "../modules/unit/model/unit";
import {Category} from "../modules/category/model/category";

export class Product {
  private _id: number;
  private _code: string;
  private _name: string;
  private _description: string;
  private _descriptionHtml: string;
  private _price: number;
  private _active: boolean;
  private _tax: Tax;
  private _unit: Unit;
  private _category: Category;



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
    if (this._description) {
      return this._description.replace('<p>', '<p class="mb-1">');
    }
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get descriptionHtml(): string {
    if (this._descriptionHtml) {
      return this._descriptionHtml.replace('<p>', '<p class="mb-1">');
    }
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

  get unit(): Unit {
    return this._unit;
  }
  set unit(value: Unit) {
    this._unit = value;
  }

  get category(): Category {
    return this._category;
  }
  set category(value: Category) {
    this._category = value;
  }

  get descriptionForPrint(): string {
    if (!this._description) return '';

    return '\n' + this.description;
  }



  get toJson(): any {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      descriptionHtml: this.descriptionHtml,
      price: this.price,
      active: this.active ?? true,
      tax: this.tax ? this.tax.toJson : null,
      unit: this.unit ? this.unit.toJson : null,
      category: this.category ? this.category.toJson : null
    };
  }

  static fromJson(json: any): Product {
    const product: Product = new Product();
    product.id = json.id;
    product.code = json.code;
    product.name = json.name;
    product.description = json.description;
    product.descriptionHtml = json.descriptionHtml;
    product.price = json.price;
    product.active = json.active;

    if (json.tax) {
      product.tax = Tax.fromJson(json.tax);
    }

    if (json.unit) {
      product.unit = Unit.fromJson(json.unit);
    }

    if (json.category) {
      product.category = Category.fromJson(json.category);
    }
    return product;
  }
}
