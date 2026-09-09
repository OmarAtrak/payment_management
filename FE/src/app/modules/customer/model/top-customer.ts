export class TopCustomer {
  private _customerId: number;
  private _customerName: string;
  private _totalOperations: number;
  private _totalPayments: number;
  private _lastOperationDate: Date;
  private _hasLoyaltyCard: boolean;



  get customerId(): number {
    return this._customerId;
  }
  set customerId(value: number) {
    this._customerId = value;
  }

  get customerName(): string {
    return this._customerName;
  }
  set customerName(value: string) {
    this._customerName = value;
  }

  get totalOperations(): number {
    return this._totalOperations;
  }
  set totalOperations(value: number) {
    this._totalOperations = value;
  }

  get totalPayments(): number {
    return this._totalPayments;
  }
  set totalPayments(value: number) {
    this._totalPayments = value;
  }

  get lastOperationDate(): Date {
    return this._lastOperationDate;
  }
  set lastOperationDate(value: Date) {
    this._lastOperationDate = value;
  }

  get hasLoyaltyCard(): boolean {
    return this._hasLoyaltyCard;
  }
  set hasLoyaltyCard(value: boolean) {
    this._hasLoyaltyCard = value;
  }



  static fromJson(json: any): TopCustomer {
    const topCustomer: TopCustomer = new TopCustomer();
    topCustomer.customerId = json.customerId;
    topCustomer.customerName = json.customerName;
    topCustomer.totalOperations = json.totalOperations;
    topCustomer.totalPayments = json.totalPayments;
    topCustomer.lastOperationDate = json.lastOperationDate;
    topCustomer.hasLoyaltyCard = json.hasLoyaltyCard;

    return topCustomer;
  }
}
