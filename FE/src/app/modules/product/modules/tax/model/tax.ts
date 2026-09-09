export class Tax {
  private _id: number;
  private _name: string;
  private _rate: number;
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

  get rate(): number {
    return this._rate;
  }
  set rate(value: number) {
    this._rate = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get percentRate(): string {
    return (this._rate * 100) + '%';
  }



  get toJson(): any {
    return {
      id: this.id ?? null,
      name: this.name,
      rate: this.rate,
      active: this.active ?? true,
    }
  }

  static fromJson(json: any): Tax {
    const tax: Tax = new Tax();
    tax.id = json.id;
    tax.name = json.name;
    tax.rate = json.rate;
    tax.active = json.active;
    return tax;
  }
}
