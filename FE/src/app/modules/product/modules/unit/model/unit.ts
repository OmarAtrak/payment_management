export class Unit {
  private _id: number;
  private _name: string;
  private _abbreviation: string;
  private _active: string;



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

  get abbreviation(): string {
    return this._abbreviation;
  }
  set abbreviation(value: string) {
    this._abbreviation = value;
  }

  get active(): string {
    return this._active;
  }
  set active(value: string) {
    this._active = value;
  }



  get toJson(): any {
    return {
      id: this.id ?? null,
      name: this.name,
      abbreviation: this.abbreviation,
      active: this.active ?? true,
    };
  }

  static fromJson(data: any): Unit {
    const unit: Unit = new Unit();
    unit.id = data.id;
    unit.name = data.name;
    unit.abbreviation = data.abbreviation;
    unit.active = data.active;
    return unit;
  }
}
