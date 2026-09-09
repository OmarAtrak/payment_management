export class ExpenseType {
  private _id: number;
  private _name: string;
  private _active: boolean;



  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
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



  get toJson(): any {
    return {
      id: this.id ?? null,
      name: this.name,
      active: this.active ?? true,
    }
  }

  static fromJson(json: any): ExpenseType {
    const expenseType: ExpenseType = new ExpenseType();
    expenseType.id = json.id;
    expenseType.name = json.name;
    expenseType.active = json.active;
    return expenseType;
  }
}
