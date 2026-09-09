export class Category {
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

  static fromJson(json: any): Category {
    const category: Category = new Category();
    category.id = json.id;
    category.name = json.name;
    category.active = json.active;
    return category;
  }
}
