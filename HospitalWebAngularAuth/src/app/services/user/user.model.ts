export class User {
    public id: number;
    public email: string;
    public firstName: string;
    public lastName: string;
    public role: Role;
    public isSuperAdmin: boolean;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id != null ? Number(data.id) : null;
        this.email = data.email != null ? String(data.email) : null;
        this.firstName = data.firstName != null ? String(data.firstName) : null;
        this.lastName = data.lastName != null ? String(data.lastName) : null;
        this.role = new Role(data.role);
        this.isSuperAdmin = data.isSuperAdmin != null ? data.isSuperAdmin : null;
    }
}

export class Role {
    public id: number;
    public name: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id != null ? Number(data.id) : null;
        this.name = data.name != null ? String(data.name) : null;
    }
}