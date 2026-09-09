export class Route {
    private _id:number;
    private _name:string;
    private _path:string;
    private _position:number;
    private _version:number;
    private _icon:string;
    private _descriptionEnglish:string;
    private _descriptionFrench:string;
    private _descriptionArabic:string;
    private _category:string;

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

    public get path():string {
        return this._path;
    }
    public set path(path:string) {
        this._path = path;
    }

    public get position():number {
        return this._position;
    }
    public set position(position:number) {
        this._position = position;
    }

    public get version():number {
        return this._version;
    }
    public set version(version:number) {
        this._version = version;
    }

    public get icon():string {
        return this._icon;
    }
    public set icon(icon:string) {
        this._icon = icon;
    }

    public get descriptionEnglish():string {
        return this._descriptionEnglish;
    }
    public set descriptionEnglish(descriptionEnglish:string) {
        this._descriptionEnglish = descriptionEnglish;
    }

    public get descriptionFrench():string {
        return this._descriptionFrench;
    }
    public set descriptionFrench(descriptionFrench:string) {
        this._descriptionFrench = descriptionFrench;
    }

    public get descriptionArabic():string {
        return this._descriptionArabic;
    }
    public set descriptionArabic(descriptionArabic:string) {
        this._descriptionArabic = descriptionArabic;
    }

    public get category():string {
        return this._category;
    }
    public set category(category:string) {
        this._category = category;
    }



    public get toJson() {
        return {
            id: this.id ? this.id : null,
            name: this.name,
            path: this.path,
            position: this.position,
            version: this.version,
            icon: this.icon,
            descriptionEnglish: this.descriptionEnglish,
            descriptionFrench: this.descriptionFrench,
            descriptionArabic: this.descriptionArabic,
            category: this.category
        }
    }

    public fromJson(jsonData: any): void {
      this.id = jsonData.id;
      this.name = jsonData.name;
      this.path = jsonData.path;
      this.position = jsonData.position;
      this.version = jsonData.version;
      this.icon = jsonData.icon;
      this.descriptionEnglish = jsonData.descriptionEnglish;
      this.descriptionFrench = jsonData.descriptionFrench;
      this.descriptionArabic = jsonData.descriptionArabic;
      this.category = jsonData.category;
    }
}
