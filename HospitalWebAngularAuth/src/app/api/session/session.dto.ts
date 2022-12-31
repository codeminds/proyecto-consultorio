export class LoginSessionDTO {
    public email: string;
    public password: string;

    constructor(username: string, password: string) {
        this.email = username;
        this.password = password;
    }
}

export class FilterSessionDTO {
    public addressRefresh: string;
    public addressIssued: string;
    public dateFrom: Date;
    public dateTo: Date;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.addressRefresh = data.addressRefresh != null ? String(data.addressRefresh) : null;
        this.addressIssued = data.addressIssued != null ? String(data.addressIssued) : null;
        this.dateFrom = data.dateFrom != null ? new Date(data.dateFrom) : null;
        this.dateTo = data.dateTo != null ? new Date(data.dateTo) : null;
    }
}