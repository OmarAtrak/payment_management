import {Contact} from "../../shared/model/contact";

export class Company {
  private _id: number;
  private _rc: string;
  private _name: string
  private _ice: string;
  private _ifu: string;
  private _cnss: string;
  private _tp: string;
  private _active: boolean;
  private _siteWeb: string;
  private _contact: Contact;



  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get rc(): string {
    return this._rc;
  }
  set rc(value: string) {
    this._rc = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get ice(): string {
    return this._ice;
  }
  set ice(value: string) {
    this._ice = value;
  }

  get ifu(): string {
    return this._ifu;
  }
  set ifu(value: string) {
    this._ifu = value;
  }

  get cnss(): string {
    return this._cnss;
  }
  set cnss(value: string) {
    this._cnss = value;
  }

  get tp(): string {
    return this._tp;
  }
  set tp(value: string) {
    this._tp = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get siteWeb(): string {
    return this._siteWeb;
  }
  set siteWeb(value: string) {
    this._siteWeb = value;
  }

  get contact(): Contact {
    return this._contact;
  }
  set contact(value: Contact) {
    this._contact = value;
  }



  get toJson(): any {
    return {
      id: this.id ?? null,
      rc: this.rc,
      name: this.name,
      ice: this.ice,
      ifu: this.ifu,
      cnss: this.cnss,
      tp: this.tp,
      siteWeb: this.siteWeb,
      active: this.active,
      contact: this.contact ? this.contact.toJson : null
    }
  }

  static fromJson(json: any): Company {
    const company = new Company();
    company.id = json.id;
    company.rc = json.rc;
    company.name = json.name;
    company.ice = json.ice;
    company.ifu = json.ifu;
    company.cnss = json.cnss;
    company.tp = json.tp;
    company.siteWeb = json.siteWeb;
    company.active = json.active;

    if (json.contact) {
      company.contact = Contact.fromJson(json.contact);
    }

    return company;
  }
}
