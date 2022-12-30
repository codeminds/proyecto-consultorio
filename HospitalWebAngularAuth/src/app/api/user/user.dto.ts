import { User } from "./user.model";

export class UpdateUserInfo {
   public readonly firstName: string;
   public readonly lastName: string;

   constructor(data: User) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
   }
}

export class UpdateUserEmail {
   public readonly email: string;

   constructor(data: User) {
      this.email = data.email;
   }
}

export class UpdateUserPassword {
   public readonly password: string;

   constructor(data: string) {
      this.password = data;
   }
}