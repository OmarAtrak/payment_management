export class Contact {
    private _id: number;
    private _phoneNumber: string;
    private _fax: string;
    private _email: string;
    private _active: boolean;



    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }
    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    get fax(): string {
        return this._fax;
    }
    set fax(value: string) {
        this._fax = value;
    }

    get email(): string {
        return this._email;
    }
    set email(value: string) {
        this._email = value;
    }

    get active(): boolean {
        return this._active;
    }
    set active(value: boolean) {
        this._active = value;
    }



    get toJson() {
        return {
            id: this.id ? this.id : null,
            phoneNumber: this.phoneNumber,
            fax: this.fax,
            email: this.email,
            active: this.active ?? true,
        };
    }

    static fromJson(dataValues: any): Contact {
        const contact = new Contact();
        contact.id = dataValues.id;
        contact.phoneNumber = dataValues.phoneNumber;
        contact.fax = dataValues.fax;
        contact.email = dataValues.email;
        contact.active = dataValues.active;

        return contact;
    }
}
