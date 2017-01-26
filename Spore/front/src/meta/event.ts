
export class Event implements IEvent {
    public id: string;
    public title: string;
    public startDate: Date;
    public endDate: Date;
    public description: string;
}

export interface IEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
}
