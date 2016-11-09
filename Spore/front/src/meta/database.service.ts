import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../meta/User';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DatabaseService {
    /// ######################################## ///
    private server = 'https://localhost:8081';
    // private server = 'https://spore.life';
    /// ######################################## ///

    constructor(private http: Http) { }

    getUser(id: string): Promise<User> {
        return this.http
            .get(this.BuildGetRequest(id))
            .toPromise()
            .then(response => this.BuildUserFromResponse(response.json()))
            .catch(this.handleError);
    }

    addUser(user: User): Promise<Response> {
        return this.http
            .get(this.BuildSaveRequest(user))
            .toPromise()
            .then(response => response.json().data as Response)
            .catch(this.handleError);
    }

    echo(something: string) {
        return this.http
            .get(this.BuildEchoRequest(something))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred: ', error);
        return Promise.reject(error.message || error);
    }

    private BuildGetRequest(id: string): string {
        return this.server + '/get?user=' + id;
    }

    private BuildSaveRequest(user: User): string {
        return this.server + '/save?user=' + user.UserID + '&email=' + user.Email + '&lname=' + user.LastName + '&fname=' + user.FirstName;
    }

    private BuildEchoRequest(something: string): string {
        return this.server + '/echo?value=' + something;
    }
    
    private BuildUserFromResponse(response: any): User {
        if(response) {
            return new User(response.UserID, response.FirstName, response.LastName, response.Email);
        }
        return new User();
    }
}