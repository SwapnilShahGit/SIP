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
import { Course } from '../meta/course';

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

    public getUserFromFacebookID(id: string): any {
        return this.http
            .get(this.BuildGetUserRequestWithFacebook(id))
            .toPromise()
            .then(response => {
                let responseObj = response.json();
                this.loadUser(responseObj.data._id);
                return responseObj;
            })
            .catch(this.handleError);
    }

    public getUserFromEmailPassword(email: string, password: string) : any {
        return this.http
            .get(this.BuildGetUserRequestWithEmailPassword(email, password))
            .toPromise()
            .then(response => {
                let responseObj = response.json();
                this.loadUser(responseObj.data._id);
                return responseObj;
            })
            .catch(this.handleError);
    }

    public addUser(user: User): any {
        return this.http
            .post(this.BuildPostUserRequest(user),
              {
                fb: user.facebookID, first: user.firstName, last: user.lastName,
                email: user.email, pic: user.pictureURL, pass: user.password,
                school: user.school, theme: user.theme, tasks: user.tasks
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public updateUser(user: User): any {
        return this.http
            .put(this.BuildPutUserRequest(user),
              {
                user: user.userID, fb: user.facebookID ? user.facebookID : undefined, first: user.firstName,
                last: user.lastName, email: user.email, pic: user.pictureURL,
                pass: user.password, school: user.school, theme: user.theme, tasks: user.tasks
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
            .post(this.BuildAddEventRequest(),
              {
                user: userId, start: event.startDate, end: event.endDate, title: event.title,
                colour: event.colour, ranges: event.ranges, dow: event.dow
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
            .put(this.BuildUpdateEventRequest(),
              {
                title: event.title, start: event.startDate, end: event.endDate, event: event.id,
                colour: event.colour, ranges: event.ranges, dow: event.dow
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public addCourse(userId: string, course: Course) {
        return this.http
            .post(this.BuildAddCourseRequest(), {
                code: course.code, user: userId, is_parse: false,
                instructor: course.instructor, description: course.description,
                lectures: course.lectures, tutorials: course.tutorials,
                practicals: course.practicals, colour: course.colour,
                exams: course.exams, exam_info: course.exam_info,
                office_hours: course.office_hours, office_location: course.office_location
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public deleteCourse(userId: string, course: Course) {
        return this.http
            .delete(this.BuildDeleteCourseRequest(userId, course.id))
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public updateCourse(course: Course) {
        return this.http
            .put(this.BuildUpdateCourseRequest(), {
                id: course.id, code: course.code, is_parse: false,
                instructor: course.instructor, description: course.description,
                lectures: course.lectures, tutorials: course.tutorials,
                practicals: course.practicals, colour: course.colour,
                exams: course.exams, exam_info: course.exam_info,
                office_hours: course.office_hours, office_location: course.office_location
              })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public getUserCourses(userId: string) {
        return this.http
            .get(this.BuildGetUserCoursesRequest(userId))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private BuildGetUserRequest(id: string): string {
        return this.server + '/api/users?'
            + 'user=' + encodeURIComponent(id);
    }

    private BuildGetUserRequestWithFacebook(id: string): string {
        return this.server + '/api/users?'
            + 'fb=' + encodeURIComponent(id);
    }

    private BuildGetUserRequestWithEmailPassword(email: string, password: string): string {
        return this.server + '/api/users?'
            + 'email=' + encodeURIComponent(email)
            + '&pass=' + encodeURIComponent(password);
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

    private BuildAddEventRequest(): string {
        return this.BuildEventRequest();
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
    }

    private BuildUpdateEventRequest(): string {
        return this.BuildEventRequest();
    }

    private BuildEventRequest() {
        return this.server + '/api/events';
    }

    private BuildAddCourseRequest() {
        return this.BuildCourseRequest();
    }

    private BuildUpdateCourseRequest() {
        return this.BuildCourseRequest();
    }

    private BuildDeleteCourseRequest(userId: string, courseId: string) {
        return this.server + '/api/courses?'
            + 'user=' + encodeURIComponent(userId)
            + '&id=' + encodeURIComponent(courseId);
    }

    private BuildGetUserCoursesRequest(userId: string) {
        return this.server + '/api/courses?'
            + 'user=' + encodeURIComponent(userId);
    }

    private BuildCourseRequest() {
        return this.server + '/api/courses';
    }

    private BuildUserFromResponse(response: any): User {
        if (response && response.data) {
            return new User(response.data._id, response.data.first, response.data.last,
              response.data.pass, response.data.email,
              response.data.facebook_id, response.data.picture_uri,
              response.data.school, response.data.theme, response.data.tasks);
        }
        return new User();
    }

    private handleError(error: any) {
        console.error('IN ERROR HANDLER: An error occurred: ', error);
        return Promise.reject(error.message || error);
    }
}
