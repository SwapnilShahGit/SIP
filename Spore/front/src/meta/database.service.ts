import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../meta/user';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Event } from '../meta/event';
import { Moment } from 'moment';

@Injectable()
export class DatabaseService {

    private server: string = ENV === 'production'
      ? 'https://spore.life' : 'https://localhost:8081';
    public user: Observable<User>;
    public _user: BehaviorSubject<User>;
    private dataStore: {
        user: User
    };

    constructor(private http: Http) {
        this.dataStore = { user: new User() };
        this._user = <BehaviorSubject<User>>new BehaviorSubject(new User);
        this.user = this._user.asObservable();
    }

    public loadUser(id: string) {
        this.http
            .get(this.BuildGetUserRequest(id))
            .map(response => this.BuildUserFromResponse(response.json()))
            .subscribe(data => {
                console.log('IN LOADUSER');
                this.dataStore.user = data;
                this._user.next(Object.assign({}, this.dataStore).user);
            }, error => console.log('Could not load user.'));
    }

    public getUser(id: string): any {
        this.loadUser(id);
        return this.http
            .get(this.BuildGetUserRequest(id))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public addUser(user: User): any {
        this.loadUser(user.UserID);
        return this.http
            .post(this.BuildPostUserRequest(user),
              {
                fb: user.FacebookID, first: user.FirstName, last: user.LastName,
                email: user.Email, pic: user.PictureURL, pass: user.Password,
                gender: user.Gender, school: user.School, theme: user.Theme
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public updateUser(user: User): any {
        return this.http
            .put(this.BuildPutUserRequest(user),
              {
                user: user.UserID, fb: user.FacebookID, first: user.FirstName,
                last: user.LastName, email: user.Email, pic: user.PictureURL,
                pass: user.Password, gender: user.Gender, school: user.School,
                theme: user.Theme
              })
            .toPromise()
            .then(response => response.json() as Response)
            .catch(this.handleError);
    }

    public echo(something: string): any {
        return this.http
            .get(this.BuildEchoRequest(something))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public addEvent(userId: string, event: Event): any {
        return this.http
            .post(this.BuildAddEventRequest(userId, event),
              {
                user: userId, start: event.StartDate, end: event.EndDate, title: event.Title
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public getUserEvents(userId: string, start: Moment, end: Moment): any {
        return this.http
            .get(this.BuildGetUserEventsRequest(userId, start, end))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public deleteEvent(eventId: string): any {
        return this.http
            .delete(this.BuildDeleteEventRequest(eventId))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public deleteUserEvent(userId: string, eventId: string): any {
        return this.http
            .delete(this.BuildDeleteUserEventRequest(userId, eventId))
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public updateEvent(event: Event) {
        return this.http
            .put(this.BuildUpdateEventRequest(event),
              {
                title: event.Title, start: event.StartDate, end: event.EndDate, event: event.Id
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private BuildGetUserRequest(id: string): string {
        return this.server + '/api/users?'
            + 'fb=' + encodeURIComponent(id);
    }

    private BuildPutUserRequest(user: User): string {
      return this.server + '/api/users?'
            + 'user=' + encodeURIComponent(user.UserID)
            + '&fb=' + encodeURIComponent(user.FacebookID)
            + '&email=' + encodeURIComponent(user.Email)
            + '&last=' + encodeURIComponent(user.LastName)
            + '&first=' + encodeURIComponent(user.FirstName)
            + '&pic=' + encodeURIComponent(user.PictureURL)
            + '&pass=' + encodeURIComponent(user.Password)
            + '&gender=' + encodeURIComponent(user.Gender)
            + '&school=' + encodeURIComponent(user.School)
            + '&theme=' + encodeURIComponent(user.Theme);
    }

    private BuildPostUserRequest(user: User): string {
        return this.server + '/api/users?'
            + 'fb=' + encodeURIComponent(user.FacebookID)
            + '&email=' + encodeURIComponent(user.Email)
            + '&last=' + encodeURIComponent(user.LastName)
            + '&first=' + encodeURIComponent(user.FirstName)
            + '&pic=' + encodeURIComponent(user.PictureURL)
            + '&pass=' + encodeURIComponent(user.Password)
            + '&gender=' + encodeURIComponent(user.Gender)
            + '&school=' + encodeURIComponent(user.School)
            + '&theme=' + encodeURIComponent(user.Theme);
    }

    private BuildEchoRequest(something: string): string {
        return this.server + '/api/echo?'
            + 'value=' + encodeURIComponent(something);
    }

    private BuildAddEventRequest(userId: string, event: Event): string {
        let startRequest = event.StartDate ? '&start='
          + encodeURIComponent(event.StartDate.toISOString()) : '';
        let endRequest = event.EndDate ? '&end='
          + encodeURIComponent(event.EndDate.toISOString()) : '';
        let titleRequest = event.Title ? '&title=' + encodeURIComponent(event.Title) : '';
        return this.server + '/api/events?'
            + 'user=' + encodeURIComponent(userId)
            + startRequest
            + endRequest
            + titleRequest;
    }

    private BuildGetUserEventsRequest(userId: string, start: Moment, end: Moment): string {
        return this.server + '/api/events?'
            + 'user=' + encodeURIComponent(userId)
            + '&start=' + encodeURIComponent(start.toISOString())
            + '&end=' + encodeURIComponent(end.toISOString());
    }

    private BuildDeleteEventRequest(eventId: string): string {
        return this.server + '/api/events?'
            + 'Event=' + encodeURIComponent(eventId);
    }

    private BuildDeleteUserEventRequest(userId: string, eventId: string): string {
        return this.server + '/api/events?'
            + 'user=' + encodeURIComponent(userId)
            + '&event=' + encodeURIComponent(eventId);
    }

    private BuildUpdateEventRequest(event: Event): string {
        let titleRequest = event.Title ? '&title=' + event.Title : '';
        let startRequest = event.StartDate ? '&start=' + event.StartDate.toISOString() : '';
        let endRequest = event.EndDate ? '&end=' + event.EndDate.toISOString() : '';
        let descriptionRequest = event.Description ? '&desc=' + event.Description : '';
        return this.server + '/api/events?'
            + 'Event=' + event.Id
            + titleRequest
            + startRequest
            + endRequest
            + descriptionRequest;
    }

    private BuildUserFromResponse(response: any): User {
        if (response && response.data) {
            return new User(response.data._id, response.data.first, response.data.last,
              response.data.pass, response.data.email, response.data.gender,
              response.data.facebook_id, response.data.picture_uri, response.data.school);
        }
        return new User();
    }

    private handleError(error: any) {
        console.error('IN ERROR HANDLER: An error occurred: ', error);
        return Promise.reject(error.message || error);
    }
}
