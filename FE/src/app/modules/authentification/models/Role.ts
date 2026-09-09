import {Route} from "./Route";

export class Role {
    private _id:number;
    private _name:string;
    private _routes:Array<Route>

    public get id():number {
        return this._id;
    }
    public set id(id:number) {
        this._id = id;
    }

    public get name():string {
        return this._name;
    }
    public set name(name:string) {
        this._name = name;
    }

    public get routes():Array<Route> {
        return this._routes;
    }
    public set routes(routes:Array<Route>) {
        this._routes = routes;
    }

    routesToJson() {
        if (this.routes != undefined && this.routes.length > 0) {
            const dataValues: any[] = [];
            this.routes.forEach(element => {
                dataValues.push(element.toJson);
            });
            return dataValues;
        }
        else {
            return null;
        }
    }

    public get toJson() {
        return {
            id: this.id ? this.id : null,
            name: this.name,
            routes: this.routesToJson()
        }
    }

    public fromJson(jsonData: any): void {
      this.id = jsonData.id;
      this.name = jsonData.name;

      this.routes = [];
      if(jsonData.routes) {
        jsonData.routes.forEach((routeData: any) => {
          const route: Route = new Route();
          route.fromJson(routeData);
          this.routes.push(route);
        });
      }
    }
}
