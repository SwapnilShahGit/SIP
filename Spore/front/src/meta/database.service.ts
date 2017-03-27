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

    public user: Observable<User>;
    public _user: BehaviorSubject<User>;
    private dataStore: {
        user: User
    };
    private server: string = ENV === 'production'
      ? 'https://spore.life' : 'https://localhost:8081';

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
        this.loadUser(user.userID);
        return this.http
            .post(this.BuildPostUserRequest(user),
              {
                fb: user.facebookID, first: user.firstName, last: user.lastName,
                email: user.email, pic: user.pictureURL, pass: user.password,
                school: user.school, theme: user.theme
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public updateUser(user: User): any {
        return this.http
            .put(this.BuildPutUserRequest(user),
              {
                user: user.userID, fb: user.facebookID, first: user.firstName,
                last: user.lastName, email: user.email, pic: user.pictureURL,
                pass: user.password, school: user.school, theme: user.theme
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
                user: userId, start: event.startDate, end: event.endDate, title: event.title, bg: event.colour
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
                title: event.title, start: event.startDate, end: event.endDate, event: event.id, bg: event.colour
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
      return this.server + '/api/users';
    }

    private BuildPostUserRequest(user: User): string {
        return this.server + '/api/users';
    }

    private BuildEchoRequest(something: string): string {
        return this.server + '/api/echo?'
            + 'value=' + encodeURIComponent(something);
    }

    private BuildAddEventRequest(userId: string, event: Event): string {
        let startRequest = event.startDate ? '&start='
          + encodeURIComponent(event.startDate.toISOString()) : '';
        let endRequest = event.endDate ? '&end='
          + encodeURIComponent(event.endDate.toISOString()) : '';
        let titleRequest = event.title ? '&title=' + encodeURIComponent(event.title) : '';
        let colourRequest = event.colour ? '&bg=' + encodeURIComponent(event.colour) : '';
        return this.server + '/api/events?'
            + 'user=' + encodeURIComponent(userId)
            + startRequest
            + endRequest
            + titleRequest
            + colourRequest;
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
        let titleRequest = event.title ? '&title=' + encodeURIComponent(event.title) : '';
        let startRequest = event.startDate ? '&start=' + encodeURIComponent(event.startDate.toISOString()) : '';
        let endRequest = event.endDate ? '&end=' + encodeURIComponent(event.endDate.toISOString()) : '';
        let descriptionRequest = event.description ? '&desc=' + encodeURIComponent(event.description) : '';
        let colourRequest = event.colour ? '&bg=' + encodeURIComponent(event.colour) : '';
        return this.server + '/api/events?'
            + 'Event=' + encodeURIComponent(event.id)
            + titleRequest
            + startRequest
            + endRequest
            + descriptionRequest
            + colourRequest;
    }

    private BuildUserFromResponse(response: any): User {
        if (response && response.data) {
            return new User(response.data._id, response.data.first, response.data.last,
              response.data.pass, response.data.email,
              response.data.facebook_id, response.data.picture_uri,
              response.data.school, response.data.theme);
        }
        return new User();
    }

    private handleError(error: any) {
        console.error('IN ERROR HANDLER: An error occurred: ', error);
        return Promise.reject(error.message || error);
    }
}
