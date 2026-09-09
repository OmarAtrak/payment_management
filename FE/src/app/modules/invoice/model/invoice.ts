import {Customer} from "../../customer/model/customer";
import {InvoiceStatus} from "./invoice-status";
import {ProductItem} from "./product-item";
import {ServiceItem} from "./service-item";
import {Payment} from "./payment";

export  class Invoice {
  private _id: number;
  private _code: string;
  private _date: Date;
  private _customer: Customer;
  private _status: InvoiceStatus;
  private _active: boolean;
  private _payments: Array<Payment>;
  private _products: Array<ProductItem>;
  private _services: Array<ServiceItem>;
  private _discount: number;



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

  get date(): Date {
    return this._date;
  }
  set date(value: Date) {
    this._date = value;
  }

  get customer(): Customer {
    return this._customer;
  }
  set customer(value: Customer) {
    this._customer = value;
  }

  get status(): InvoiceStatus {
    return this._status;
  }
  set status(value: InvoiceStatus) {
    this._status = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get payments(): Array<Payment> {
    return this._payments;
  }
  set payments(value: Array<Payment>) {
    this._payments = value;
  }

  get products(): Array<ProductItem> {
    return this._products;
  }
  set products(value: Array<ProductItem>) {
    this._products = value;
  }

  get services(): Array<ServiceItem> {
    return this._services;
  }
  set services(value: Array<ServiceItem>) {
    this._services = value;
  }

  get discount(): number {
    return this._discount;
  }
  set discount(value: number) {
    this._discount = value;
  }

  get paymentsToJson(): any {
    return this.payments
      ? this.payments.map(p => p.toJson)
      : [];
  }
  get productsToJson(): any {
    return this.products
      ? this.products.map(p => p.toJson)
      : [];
  }
  get servicesToJson(): any {
    return this.services
      ? this.services.map(s => s.toJson)
      : [];
  }

  get classStyle(): string {
    return 'badge ' + (this.status === InvoiceStatus.POSTED
      ? 'bg-success'
        : this.status === InvoiceStatus.VOIDED
          ? 'bg-danger'
          : 'bg-secondary');
  }

  get totalProductsHT(): number {
    return this.products
      ? this.products
        .filter(p => p.active)
        .reduce((sum, p) => sum + p.totalHT, 0)
      : 0;
  }
  get totalProductsTVA(): number {
    return this.products
      ? this.products
        .filter(p => p.active)
        .reduce((sum, p) => sum + (p.priceTVA * p.quantity), 0)
      : 0;
  }
  get totalProductsTTC(): number {
    return this.products
      ? this.products
        .filter(p => p.active)
        .reduce((sum, p) => sum + p.totalTTC, 0)
      : 0;
  }

  get discountValueForServices(): number {
    return this.discount > 0 ? this.totalServicesHT * (this.discount / 100) : 0;
  }

  get totalServicesHT(): number {
    return this.services
      ? this.services
        .filter(s => s.active)
        .reduce((sum, s) => sum + s.price, 0)
      : 0;
  }
  get totalServicesTVA(): number {
    return this.services
      ? this.services
        .filter(s => s.active)
        .reduce((sum, s) => sum + s.priceTVA, 0)
      : 0;
  }
  get totalServicesTTC(): number {
    return this.services
      ? this.services
        .filter(s => s.active)
        .reduce((sum, s) => sum + s.priceTTC, 0)
      : 0;
  }

  get totalServicesTTCAfterDiscount(): number {
    const total = this.services
      ? this.services
        .filter(s => s.active)
        .reduce((sum, s) => sum + s.priceTTC, 0)
      : 0;

    if (this.discount > 0) {
      return total - (total * (this.discount / 100));
    }

    return total;
  }

  get totalHT(): number {
    return this.totalProductsHT + (this.totalServicesHT - this.discountValueForServices);
  }
  get totalTVA(): number {
    return this.totalHT * 0.2;
  }
  get totalTTC(): number {
    return this.totalProductsTTC + this.totalServicesTTC;
  }
  get totalTTCAfterDiscount(): number {
    return this.totalProductsTTC + this.totalServicesTTCAfterDiscount;
  }

  // Payments
  get totalPaymentPaid(): number {
    return this.payments
      .filter(p => p.status == 'PAID')
      .reduce((total, p) => total + (p.amount || 0), 0);
  }
  get totalPaymentRemaining(): number {
    const total = this.discount > 0 ? this.totalTTCAfterDiscount : this.totalTTC;
    return Number((total - this.totalPaymentPaid).toFixed(2));
  }



  get toJson(): any {
    return {
      id: this.id ?? null,
      code: this.code,
      date: this.date,
      active: this.active ?? true,
      customer: this.customer ? { id: this.customer.id } : null,
      amountTva: 0,
      amountTtc: 0,
      status: this.status,
      payments: this.paymentsToJson,
      products: this.productsToJson,
      services: this.servicesToJson,
      discount: this.discount,
    }
  }

  static fromJson(json: any): Invoice {
    const invoice = new Invoice();
    invoice.id = json.id;
    invoice.code = json.code;
    invoice.date = json.date;
    invoice.customer = json.customer;
    invoice.status = json.status;
    invoice.discount = json.discount ?? 0;

    invoice.payments = [];
    if (json.payments) {
      invoice.payments = json.payments
        .map((paymentJson: any) => Payment.fromJson(paymentJson))
        .filter((payment: Payment) => payment.active);
    }

    invoice.products = [];
    if (json.productItems) {
      invoice.products = json.productItems
        .map((productJson: any) => ProductItem.fromJson(productJson))
        .filter((product: ProductItem) => product.active)
        .sort((a: ProductItem, b: ProductItem) => a.id - b.id);
    }

    invoice.services = [];
    if (json.serviceItems) {
      invoice.services = json.serviceItems
        .map((serviceJson: any) => ServiceItem.fromJson(serviceJson))
        .filter((service: ServiceItem) => service.active)
        .sort((a: ServiceItem, b: ServiceItem) => a.id - b.id);
    }

    return invoice;
  }
}
