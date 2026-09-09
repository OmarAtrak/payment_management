export class Address {
  private _id: number;
  private _address: string;
  private _addressArabic: string;
  private _city: string;
  private _active: boolean;



  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get address(): string {
    return this._address;
  }
  set address(value: string) {
    this._address = value;
  }

  get addressArabic(): string {
    return this._addressArabic;
  }
  set addressArabic(value: string) {
    this._addressArabic = value;
  }

  get city(): string {
    return this._city;
  }
  set city(value: string) {
    this._city = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }



  get toJson(): any {
    return {
      id: this.id ? this.id : null,
      address: this.address,
      addressArabic: this.addressArabic,
      city: this.city,
      active: this.active ?? true
    };
  }

  static fromJson(json: any): Address {
    const address = new Address();
    address.id = json.id;
    address.address = json.address;
    address.addressArabic = json.addressArabic;
    address.city = json.city;
    address.active = json.active;

    return address;
  }
}
