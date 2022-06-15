export class AppSettings {
    public readonly title: string;

    constructor(data: any){
        this.title = data.title || null;
    }
}