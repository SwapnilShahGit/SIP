
export class Event implements IEvent {
    Id: number;
    Title: string;
    Start: string;
    End: string;
    AllDay: boolean = true;
}

export interface IEvent {
    Id: number;
    Title: string;
    Start: string;
    End: string;
    AllDay: boolean
}