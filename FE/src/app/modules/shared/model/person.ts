import {capitalizeFirstLetter} from "src/app/modules/application/app.global";

export class Person {
    private _id:number;
    private _firstName:string;
    private _lastName:string;
    private _firstNameArb:string;
    private _lastNameArb:string;
    private _gender:string;
    private _version:number;



    public get id(): number {
        return this._id;
    }
    public set id (id:number) {
        this._id = id;
    }

    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(firstName:string) {
        this._firstName = firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }
    public set lastName(lastName:string) {
        this._lastName = lastName;
    }

    public get fullName(): string {
      return capitalizeFirstLetter(this.firstName) + ' ' + capitalizeFirstLetter(this.lastName);
    }

    public get gender(): string {
        return this._gender;
    }
    public set gender(gender:string) {
        this._gender = gender;
    }

    public get version(): number {
        return this._version;
    }
    public set version(version:number) {
        this._version = version;
    }
    get firstNameArb(): string {
        return this._firstNameArb;
    }
    set firstNameArb(value: string) {
        this._firstNameArb = value;
    }

    get lastNameArb(): string {
        return this._lastNameArb;
    }
    set lastNameArb(value: string) {
        this._lastNameArb = value;
    }

}
