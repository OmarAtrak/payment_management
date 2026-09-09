export class File {
    private _id:number;
    private _fileName:string;
    private _fileType:string;
    private _data:string;
    private _active:boolean;


    public get id(): number {
        return this._id;
    }
    public set id(id:number) {
        this._id = id;
    }

    public get fileName(): string {
        return this._fileName;
    }
    public set fileName(fileName:string) {
        this._fileName = fileName;
    }
    
    public get fileType(): string {
        return this._fileType;
    }
    public set fileType(fileType:string) {
        this._fileType = fileType;
    }
    
    public get data(): string {
        return this._data;
    }
    public set data(data:string) {
        this._data = data;
    }
    
    public get active(): boolean {
        return this._active;
    }
    public set active(active:boolean) {
        this._active = active;
    }



    public get toJson() {
        return {
            id: this.id ? this.id : null,
            fileName: this.fileName,
            fileType: this.fileType,
            data: this.data,
            active: this.active,
        }
    }

    public fromJson(jsonData:any) {
        this.id = jsonData.id;
        this.fileName = jsonData.fileName;
        this.fileType = jsonData.fileType;
        this.data = jsonData.data;
        this.active = jsonData.active;
    }
}