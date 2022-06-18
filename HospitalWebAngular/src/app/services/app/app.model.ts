export class AppSettings {
    public readonly title: string;

    constructor(data: any = null){
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.title = data.title != null ? String(data.title) : null;
    }
}