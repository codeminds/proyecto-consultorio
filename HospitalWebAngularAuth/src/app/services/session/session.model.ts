export class Session {
    public accessToken: string;
    public refreshToken: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};
        
        this.accessToken = data.accessToken != null ? String(data.accessToken) : null;
        this.refreshToken = data.refreshToken != null ? String(data.refreshToken) : null;
    }
}