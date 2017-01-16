
export class Event implements IEvent {
    Id: string;
    Title: string;
    StartDate: Date;
    EndDate: Date;
    Description: string;
}

export interface IEvent {
    Id: string;
    Title: string;
    StartDate: Date;
    EndDate: Date;
    Description: string;
}
