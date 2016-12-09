
export class Event implements IEvent {
    Id: number;
    Title: string;
    Start: Date;
    End: Date;
    AllDay: boolean = true;
}

export interface IEvent {
    Id: number;
    Title: string;
    Start: Date;
    End: Date;
    AllDay: boolean
}