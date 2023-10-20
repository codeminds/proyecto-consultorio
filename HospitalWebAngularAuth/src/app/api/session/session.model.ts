export class Session {
    public sessionId: string;
    public dateIssued: Date;
    public dateRefreshed: Date;
    public dateExpiry: Date;
    public addressIssued: string;
    public addressRefreshed: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};
        
        this.sessionId = data.sessionId ?? null;
        this.dateIssued = data.dateIssued ? new Date(data.dateIssued) : null;
        this.dateRefreshed = data.dateRefreshed ? new Date(data.dateRefreshed) : null;
        this.dateExpiry = data.dateExpiry ? new Date(data.dateExpiry) : null;
        this.addressIssued = data.addressIssued ?? null;
        this.addressRefreshed = data.addressRefreshed ?? null;
    }
}

export class SessionTokens {
    public accessToken: string;
    public refreshToken: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};
        
        this.accessToken = data.accessToken ?? null;
        this.refreshToken = data.refreshToken ?? null;
    }
}