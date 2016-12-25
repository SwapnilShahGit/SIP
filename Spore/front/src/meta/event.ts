
export class Event implements IEvent {
    Id: string;
    Title: string;
    Start: Date;
    End: Date;
    AllDay: boolean = true;
}

export interface IEvent {
    Id: string;
    Title: string;
    Start: Date;
    End: Date;
    AllDay: boolean
}