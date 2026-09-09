import {Product} from "../../product/model/product";
import {Tax} from "../../product/modules/tax/model/tax";
import {Invoice} from "./invoice";

export class ProductItem {
  private _id: number;
  private _active: boolean;
  private _quantity: number;
  private _discount: number;
  private _priceHT: number;
  private _priceTTC: number;
  private _product: Product;
  private _tax: Tax;
  private _invoice: Invoice;
  private _ranking: number;



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

  get quantity(): number {
    return this._quantity;
  }
  set quantity(value: number) {
    this._quantity = value;
  }

  get discount(): number {
    return this._discount;
  }
  set discount(value: number) {
    this._discount = value;
  }

  get priceHT(): number {
    return this._priceHT;
  }
  set priceHT(value: number) {
    this._priceHT = value;
  }

  get priceTTC(): number {
    return this._priceTTC;
  }
  set priceTTC(value: number) {
    this._priceTTC = value;
  }

  get product(): Product {
    return this._product;
  }
  set product(value: Product) {
    this._product = value;
  }

  get tax(): Tax {
    return this._tax;
  }
  set tax(value: Tax) {
    this._tax = value;
  }

  get invoice(): Invoice {
    return this._invoice;
  }
  set invoice(value: Invoice) {
    this._invoice = value;
  }

  get ranking(): number {
    return this._ranking;
  }
  set ranking(value: number) {
    this._ranking = value;
  }

  get priceTVA(): number {
    if (this.tax) {
      return this.priceHT * this.tax.rate;
    }
    return 0;
  }

  get totalHT(): number {
    return this.priceHT * this.quantity;
  }

  get totalTTC(): number {
    return this.priceTTC * this.quantity;
  }



  get toJson() {
    return {
      id: this.id ?? null,
      active: this.active ?? true,
      quantity: this.quantity ?? 0,
      discount: this.discount ?? 0,
      priceHt: this.priceHT,
      priceTtc: this.priceTTC,
      product: this.product ? { id : this.product.id } : null,
      tax: this.tax ? { id : this.tax.id } : null,
      invoice: this.invoice ? { id : this.invoice.id } : null,
      ranking: this.ranking ?? 0,
    }
  }

  static fromJson(json: any): ProductItem {
    const productItem = new ProductItem();
    productItem.id = json.id;
    productItem.active = json.active;
    productItem.quantity = json.quantity ?? 0;
    productItem.discount = json.discount ?? 0;
    productItem.priceHT = json.priceHt ?? 0;
    productItem.priceTTC = json.priceTtc ?? 0;
    productItem.ranking = json.ranking ?? 0;

    if (json.product) {
      productItem.product = Product.fromJson(json.product);
    }

    if (json.tax) {
      productItem.tax = Tax.fromJson(json.tax);
    }

    if (json.invoice) {
      productItem.invoice = Invoice.fromJson(json.invoice);
    }

    return productItem;
  }
}
