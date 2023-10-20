import { UserRole } from "@utils/enums";

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

        this.id = data.id ?? null;
        this.email = data.email ?? null;
        this.firstName = data.firstName ?? null;
        this.lastName = data.lastName ?? null;
        this.role = new Role(data.role);
        this.isSuperAdmin = data.isSuperAdmin ?? null;
    }

    public hasRoles(roles: UserRole[]): boolean {
        return roles.includes(this.role.id);
    }
}

export class Role {
    public id: number;
    public name: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id ?? null;
        this.name = data.name ?? null;
    }
}