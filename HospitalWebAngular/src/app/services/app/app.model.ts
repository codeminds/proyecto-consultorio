export class AppSettings {
    public readonly title: string;

    constructor(data: any = null){
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.title = data.data != null ? String(data.title) : null;
    }
}