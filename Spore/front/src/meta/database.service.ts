import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { IUser } from '../meta/interfaces';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/toPromise';

@Injectable()
export class DatabaseService {
    /// ######################################## ///
    private server = 'https://localhost:8081';
    // private server = 'https://spore.life';
    /// ######################################## ///

    constructor(private http: Http) { }

    getUser(id: string): Observable<IUser> { //change to Observable<User>
        // return this.http
        //     .get(this.BuildGetRequest(id))
        //     .toPromise()
        //     .then(response => this.BuildUserFromResponse(response.json()))
        //     .catch(this.handleError);

        return this.http
            .get(this.BuildGetRequest(id))
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    addUser(user: IUser): Observable<any> {
        // return this.http
        //     .get(this.BuildSaveRequest(user))
        //     .toPromise()
        //     .then(response => response.json().data as Response)
        //     .catch(this.handleError);

        return this.http
            .get(this.BuildSaveRequest(user))
            .map((res: Response) => res.json())
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
        // return Promise.reject(error.message || error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private BuildGetRequest(id: string): string {
        return this.server + '/get?user=' + id;
    }

    private BuildSaveRequest(user: IUser): string {
        return this.server + '/save?user=' + user.UserID + '&email=' + user.Email + '&lname=' + user.LastName + '&fname=' + user.FirstName;
    }

    private BuildEchoRequest(something: string): string {
        return this.server + '/echo?value=' + something;
    }
    
    // private BuildUserFromResponse(response: any): IUser {
    //     if(response) {
    //         return new User(response.UserID, response.FirstName, response.LastName, response.Email);
    //     }
    //     return new User();
    // }
}