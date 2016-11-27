import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../meta/user';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DatabaseService {
    /// ######################################## ///
    private server = 'https://localhost:8081';
    // private server = 'https://spore.life';
    /// ######################################## ///

    constructor(private http: Http) { }

    getUser(id: string): any { //Observable<IUser>
        return this.http
            .get(this.BuildGetRequest(id))
            .toPromise()
            .then(response => this.BuildUserFromResponse(response.json()))
            .catch(this.handleError);

        // return this.http
        //     .get(this.BuildGetRequest(id))
        //     .map((res: Response) => res.json())
        //     .catch(this.handleError);
    }

    addUser(user: User): any { //Observable<any>
        return this.http
            .get(this.BuildSaveRequest(user))
            .toPromise()
            .then(response => response.json().data as Response)
            .catch(this.handleError);

        // return this.http
        //     .get(this.BuildSaveRequest(user))
        //     .map((res: Response) => res.json())
        //     .catch(this.handleError);
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
        // return Observable.throw(error.json().error || 'Server error');
    }

    private BuildGetRequest(id: string): string {
        return this.server + '/get?u=' + id;
    }

    private BuildSaveRequest(user: User): string {
        return this.server + '/save?u=' + user.UserID.replace('&', "%26") + '&email=' + user.Email.replace('&', "%26") + '&last=' + user.LastName.replace('&', "%26") + '&first=' + user.FirstName.replace('&', "%26");
    }

    private BuildEchoRequest(something: string): string {
        return this.server + '/echo?value=' + something;
    }
    
    private BuildUserFromResponse(response: any): User {
        if(response && response.data) {
            return new User(response.data.UserID, response.data.FirstName, response.data.LastName, response.data.Email);
        }
        return new User();
    }    
}