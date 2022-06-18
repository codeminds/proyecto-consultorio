export class AppSettings {
    public readonly title: string;

    constructor(data: any = null){
        this.title = data.data != null ? String(data.title) : null;
    }
}