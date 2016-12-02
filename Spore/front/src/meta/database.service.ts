import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../meta/user';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DatabaseService {

    private server: string = ENV == "production" ? "https://spore.life" : "https://localhost:8081";
    user: Observable<User>;
    private _user: BehaviorSubject<User>;
    private dataStore: {
        user: User
    }

    constructor(private http: Http) {
        this.dataStore = { user: new User() },
        this._user = <BehaviorSubject<User>>new BehaviorSubject(new User);
        this.user = this._user.asObservable();
    }

    loadUser(id: string) {
        this.http
            .get(this.BuildGetRequest(id))
            .map(response => this.BuildUserFromResponse(response.json()))
            .subscribe(data => {
                console.log('IN LOADUSER');
                this.dataStore.user = data;
                this._user.next(Object.assign({}, this.dataStore).user);
            }, error => console.log('Could not load user.'));
    }

    getUser(id: string): any {
        this.loadUser(id);
        return this.http
            .get(this.BuildGetRequest(id))
            .toPromise()
            .then(response => this.BuildUserFromResponse(response.json()))
            .catch(this.handleError);
    }

    addUser(user: User): any {
        this.loadUser(user.UserID);
        return this.http
            .get(this.BuildSaveRequest(user))
            .toPromise()
            .then(response => response.json().data as Response)
            .catch(this.handleError);
    }

    echo(something: string): any {
        return this.http
            .get(this.BuildEchoRequest(something))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('IN ERROR HANDLER: An error occurred: ', error);
        return Promise.reject(error.message || error);
    }

    private BuildGetRequest(id: string): string {
        return this.server + '/get?u=' + id;
    }

    private BuildSaveRequest(user: User): string {
        return this.server + '/save?u=' + encodeURIComponent(user.UserID) + '&email=' + encodeURIComponent(user.Email) + '&last=' + encodeURIComponent(user.LastName) + '&first=' + encodeURIComponent(user.FirstName);
    }

    private BuildEchoRequest(something: string): string {
        return this.server + '/echo?value=' + something;
    }

    private BuildUserFromResponse(response: any): User {
        if (response && response.data) {
            return new User(response.data.UserID, response.data.FirstName, response.data.LastName, response.data.Email);
        }
        return new User();
    }    
}