import {ExpenseType} from "../modules/expenseType/model/expense-type";
import {PaymentMethod} from "../../invoice/model/payment-method";
import {Tax} from "../../product/modules/tax/model/tax";
import {format} from "date-fns";

export class Expense {
    private _id: number;
    private _code: string;
    private _date: Date;
    private _createdDate: Date;
    private _method: PaymentMethod;
    private _amount: number;
    private _notes: string;
    private _active: boolean;
    private _expenseType: ExpenseType;
    private _tax: Tax;


    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }

    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }

    public get createdDate(): Date {
        return this._createdDate;
    }
    public set createdDate(value: Date) {
        this._createdDate = value;
    }

    public get method(): PaymentMethod {
        return this._method;
    }
    public set method(value: PaymentMethod) {
        this._method = value;
    }

    public get amount(): number {
        return this._amount;
    }
    public set amount(value: number) {
        this._amount = value;
    }

    public get notes(): string {
        return this._notes;
    }
    public set notes(value: string) {
        this._notes = value;
    }

    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }

    public get expenseType(): ExpenseType {
        return this._expenseType;
    }
    public set expenseType(value: ExpenseType) {
        this._expenseType = value;
    }

    public get tax(): Tax {
        return this._tax;
    }
    public set tax(value: Tax) {
        this._tax = value;
    }



    get toJson(): any {
        return {
            id: this.id ? this.id : null,
            code: this.code,
            date: format(this.date, 'yyyy-MM-dd HH:mm:ss'),
            method: this.method,
            amount: this.amount,
            notes: this.notes,
            active: this.active ?? true,
            expenseType: this.expenseType ? { id: this.expenseType.id } : null,
            tax: this.tax ? { id: this.tax.id } : null,
        };
    }

    static fromJson(json: any): Expense {
        const expense: Expense = new Expense();
        expense.id = json.id;
        expense.code = json.code;
        expense.createdDate = json.createdDate;
        expense.date = json.date;
        expense.method = json.method;
        expense.amount = json.amount;
        expense.notes = json.notes;
        expense.active = json.active;

        if (json.expenseType) {
          expense.expenseType = ExpenseType.fromJson(json.expenseType);
        }

        if (json.tax) {
          expense.tax = Tax.fromJson(json.tax);
        }

        return expense;
    }
}
