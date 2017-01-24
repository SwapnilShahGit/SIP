
export class Event implements IEvent {
    public Id: string;
    public Title: string;
    public StartDate: Date;
    public EndDate: Date;
    public Description: string;
}

export interface IEvent {
    Id: string;
    Title: string;
    StartDate: Date;
    EndDate: Date;
    Description: string;
}
