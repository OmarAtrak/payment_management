export class SummaryBalance {
  private _totalExpenseHT: number;
  private _totalExpenseTTC: number;
  private _totalPayment: number;
  private _totalHtToPay: number;
  private _totalInvoiceRevenue: number;



  get totalExpenseHT(): number {
    return this._totalExpenseHT;
  }
  set totalExpenseHT(value: number) {
    this._totalExpenseHT = value;
  }

  get totalExpenseTTC(): number {
    return this._totalExpenseTTC;
  }
  set totalExpenseTTC(value: number) {
    this._totalExpenseTTC = value;
  }

  get totalPayment(): number {
    return this._totalPayment;
  }
  set totalPayment(value: number) {
    this._totalPayment = value;
  }

  get totalHtToPay(): number {
    return this._totalHtToPay;
  }
  set totalHtToPay(value: number) {
    this._totalHtToPay = value;
  }

  get totalInvoiceRevenue(): number {
    return this._totalInvoiceRevenue;
  }
  set totalInvoiceRevenue(value: number) {
    this._totalInvoiceRevenue = value;
  }

  get expenseHT(): number {
    return this.totalExpenseTTC - this.totalExpenseHT;
  }
  get balanceTTC(): number {
    return this._totalExpenseTTC - this.totalPayment;
  }


  static fromJson(json: any): SummaryBalance {
    const balance = new SummaryBalance();
    balance.totalExpenseHT = json.totalExpenseHT;
    balance.totalExpenseTTC = json.totalExpenseTTC;
    balance.totalPayment = json.totalPayment;
    balance.totalHtToPay = json.totalHtToPay;
    balance.totalInvoiceRevenue = json.totalInvoiceRevenue;
    return balance;
  }
}
