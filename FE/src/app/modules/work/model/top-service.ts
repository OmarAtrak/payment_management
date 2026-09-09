export class TopService {
  private _id: number;
  private _name: string;
  private _code: string;
  private _totalRequests: number;



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

  get code(): string {
    return this._code;
  }
  set code(value: string) {
    this._code = value;
  }

  get totalRequests(): number {
    return this._totalRequests;
  }
  set totalRequests(value: number) {
    this._totalRequests = value;
  }



  static fromJson(json: any): TopService {
    const topService: TopService = new TopService();
    topService.id = json.id;
    topService.name = json.name;
    topService.code = json.code;
    topService.totalRequests = json.totalRequests;

    return topService;
  }
}
