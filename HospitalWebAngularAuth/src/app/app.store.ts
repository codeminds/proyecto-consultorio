import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "@api/user/user.model";
import { Message } from "@services/http/http.types";
import { State } from "@utils/state";

@Injectable({
    providedIn: 'root'
})
export class Store {
    //Site Message
    private readonly _siteMessage: State<Message>;
    public get $siteMessage() { return this._siteMessage.$value };
    public get siteMessage() { return this._siteMessage.value };
    public set siteMessage(value: Message) { 
        if(value != null && this._siteMessage != null) {
            this._siteMessage.value = null;
        }
    
        setTimeout(() => {
            this._siteMessage.value = value;
        }, 100);    
    };

    //Site Title
    private readonly _siteTitle: State<string>;
    public get $siteTitle() { return this._siteTitle.$value };
    public get siteTitle() { return this._siteTitle.value };
    public set siteTitle(value: string) { this._siteTitle.value = value };

    //User
    private readonly _user: State<User>;
    public get $user() { return this._user.$value };
    public get user() { return this._user.value };
    public set user(value: User) { this._user.value = value };

    constructor(
        private router: Router
    ) {
        this._siteMessage = new State();
        this._siteTitle = new State();
        this._user = new State();
    }

    public closeSession(): void {
        localStorage.clear();
        this.user = null;
        this.router.navigate(['login']);
    }
}