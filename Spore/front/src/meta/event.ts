
export class Event implements IEvent {
    public id: string;
    public title: string;
    public startDate: Date;
    public endDate: Date;
    public description: string;
    public colour: string = '#E7EAEE';
}

export interface IEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    colour: string;
}
