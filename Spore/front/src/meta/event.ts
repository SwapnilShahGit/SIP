import { Moment } from 'moment';

export class Event implements IEvent {
    Id: string;
    Title: string;
    Start: Moment;
    StartDate: Date;
    End: Moment;
    EndDate: Date;
    Description: string;
}

export interface IEvent {
    Id: string;
    Title: string;
    Start: Moment;
    StartDate: Date;
    End: Moment;
    EndDate: Date;
    Description: string;
}