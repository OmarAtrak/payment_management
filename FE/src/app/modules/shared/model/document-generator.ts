export class DocumentGenerator {
  private _id: number;
  private _name: string;
  private _content: string;
  private _type: string;
  private _active: boolean;


  public get id(): number {
    return this._id;
  }
  public set id(id: number) {
    this._id = id;
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
  }

  public get content(): string {
    return this._content;
  }
  public set content(content: string) {
    this._content = content;
  }

  public get type(): string {
    return this._type;
  }
  public set type(type: string) {
    this._type = type;
  }

  public get active(): boolean {
    return this._active;
  }
  public set active(active: boolean) {
    this._active = active;
  }

  public get toJson() {
    return {
      id: this.id ? this.id : null,
      name: this.name,
      content: this.content,
      type: this.type,
      active: this.active,
    };
  }

  public fromJson(jsonData: any) {
    this.id = jsonData.id;
    this.name = jsonData.name;
    this.content = jsonData.content;
    this.type = jsonData.type;
    this.active = jsonData.active;
  }
}
