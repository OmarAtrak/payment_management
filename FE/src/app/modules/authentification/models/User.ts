import {Role} from "./Role";
import {File} from "src/app/modules/shared/model/file";
import {Person} from "src/app/modules/shared/model/person";
import {Route} from "./Route";

export class User extends Person {
    private _email:string;
    private _password:string;
    private _enabled:boolean;
    private _emailVerified:boolean;
    private _phoneNumber:string;
    private _disabled:boolean;
    private _roles:Array<Role>;
    private _photo:File;



    public get email(): string {
        return this._email;
    }
    public set email(email:string) {
        this._email = email;
    }

    public get password(): string {
        return this._password;
    }
    public set password(password:string) {
        this._password = password;
    }

    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(enabled:boolean) {
        this._enabled = enabled;
    }

    public get emailVerified(): boolean {
        return this._emailVerified;
    }
    public set emailVerified(emailVerified:boolean) {
        this._emailVerified = emailVerified;
    }

    public get phoneNumber(): string {
        return this._phoneNumber;
    }
    public set phoneNumber(phoneNumber:string) {
        this._phoneNumber = phoneNumber;
    }

    public get disabled(): boolean {
        return this._disabled;
    }
    public set disabled(disabled:boolean) {
        this._disabled = disabled;
    }

    public get roles(): Array<Role> {
        return this._roles;
    }
    public set roles(roles:Array<Role>) {
        this._roles = roles;
    }

    public get photo(): File {
        return this._photo;
    }
    public set photo(photo:File) {
        this._photo = photo;
    }

    get isAdmin(): boolean {
      return this.roles.some(role => role.name.toLowerCase().includes('admin'));
    }
    get isStaff(): boolean {
      return this.roles.some(role => role.name.toLowerCase().includes('staff'));
    }
    get isInstructor(): boolean {
      return this.roles.some(role => role.name.toLowerCase().includes('instructor'));
    }
    get isCandidate(): boolean {
      return this.roles.some(role => role.name.toLowerCase().includes('candidate'));
    }

    get routes(): Array<Route> {
        const routesOfPerson: Array<Route> = [];
        if(this.roles != undefined && this.roles.length > 0) {
            for (let roleIndex = 0; roleIndex < this.roles.length; roleIndex++) {
                const role = this.roles[roleIndex];

                for (let routeIndex = 0; routeIndex < role.routes.length; routeIndex++) {
                    const route = role.routes[routeIndex];
                    if(!this.checkIfRouteExistsInList(route, routesOfPerson)) {
                        routesOfPerson.push(route);
                    }
                }
            }
        }
        return routesOfPerson;
    }

    rolesToJson() {
        if (this.roles != undefined && this.roles.length > 0) {
            const dataValues: any[] = [];
            this.roles.forEach(element => {
                dataValues.push(element.toJson);
            });
            return dataValues;
        }
        else {
            return null;
        }
    }

    checkIfRouteExistsInList(route: Route, routes: Array<Route>): boolean {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].id === route.id) {
                return true;
            }
        }
        return false;
    }


    public get toJson() {
        return {
            id : this.id ? this.id : null,
            firstName : this.firstName,
            lastName : this.lastName,
            gender : this.gender,
            email : this.email,
            password : this.password,
            enabled : this.enabled,
            emailVerified : this.emailVerified,
            phoneNumber : this.phoneNumber,
            disabled : this.disabled,
            roles : this.rolesToJson(),
            photo : this.photo ? this.photo.toJson : null,
            version : this.version
        }
    }

    public fromJson(jsonData:any) {
      this.id = jsonData.id;
      this.firstName = jsonData.firstName;
      this.lastName = jsonData.lastName;
      this.gender = jsonData.gender;
      this.email = jsonData.email;
      this.password = jsonData.password;
      this.enabled = jsonData.enabled;
      this.emailVerified = jsonData.emailVerified;
      this.phoneNumber = jsonData.phoneNumber;
      this.disabled = jsonData.disabled;
      this.photo = jsonData.photo;
      this.version = jsonData.version;

      this.roles = [];
      if(jsonData.roles) {
        jsonData.roles.forEach((roleData: any) => {
            const role: Role = new Role();
            role.fromJson(roleData);
            this.roles.push(role);
        });
      }
    }
}
