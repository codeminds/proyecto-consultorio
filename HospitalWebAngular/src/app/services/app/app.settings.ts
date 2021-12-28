export class AppSettings {
    public title: Readonly<string>;

    constructor(data: any){
        this.title = data.title || null;
    }
}