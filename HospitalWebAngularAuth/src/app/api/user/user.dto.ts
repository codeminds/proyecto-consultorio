import { User } from "./user.model";

export class InsertUpdateUserDTO
{ 
    public readonly email: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly newPassword: string;
    public readonly roleId: number;
 
    constructor(data: User, password: string) {
       this.email = data.email;
       this.firstName = data.firstName;
       this.lastName = data.lastName;
       this.newPassword = password;
       this.roleId = data.role.id;
    }
}

export class FilterUserDTO {
   public email: string;
   public firstName: string;
   public lastName: string;
   public roleId: number;

   constructor(data: any = null) {
       //Técnica de deep copy para eliminar referencias de memoria
       data = data ? JSON.parse(JSON.stringify(data)) : {};

       this.email = data.email ?? null;
       this.firstName = data.firstName ?? null;
       this.lastName = data.lastName ?? null;
       this.roleId = data.roleId ?? null;
   }
}