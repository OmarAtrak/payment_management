import {PaymentMethod} from "./payment-method";
import {PaymentStatus} from "./payment-status";
import {format} from "date-fns";

export class Payment {
  private _id: number;
  private _active: boolean;
  private _code: string;
  private _date: Date;
  private _createdDate: Date;
  private _paymentMethod: PaymentMethod;
  private _amount: number;
  private _status: PaymentStatus;
  private _notes: string;



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

  get createdDate(): Date {
    return this._createdDate;
  }
  set createdDate(value: Date) {
    this._createdDate = value;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }
  set paymentMethod(value: PaymentMethod) {
    this._paymentMethod = value;
  }

  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = value;
  }

  get status(): PaymentStatus {
    return this._status;
  }
  set status(value: PaymentStatus) {
    this._status = value;
  }

  get notes(): string {
    return this._notes;
  }
  set notes(value: string) {
    this._notes = value;
  }

  get classStatus(): string {
    switch (this.status) {
      case PaymentStatus.PAID:
        return 'text-success';
      case PaymentStatus.PENDING:
        return 'text-info';
      case PaymentStatus.FAILED:
        return 'text-danger';
      default:
        return '';
    }
  }

  get iconOfStatus(): string {
    switch (this.status) {
      case PaymentStatus.PAID:
        return 'check-circle';
      case PaymentStatus.PENDING:
        return 'spinner';
      case PaymentStatus.FAILED:
        return 'circle-xmark';
      default:
        return '';
    }
  }



  get toJson() {
    return {
      id: this.id ?? null,
      active: this.active ?? true,
      code: this.code,
      date: format(this.date, 'yyyy-MM-dd HH:mm:ss'),
      createdDate: this.createdDate,
      paymentMethod: this.paymentMethod,
      amount: this.amount,
      status: this.status,
      notes: this.notes,
    }
  }

  static fromJson(json: any): Payment {
    const payment = new Payment();
    payment.id = json.id;
    payment.active = json.active;
    payment.code = json.code;
    payment.date = json.date;
    payment.createdDate = json.createdDate;
    payment.paymentMethod = json.paymentMethod;
    payment.amount = json.amount;
    payment.status = json.status;
    payment.notes = json.notes;
    return payment;
  }
}
