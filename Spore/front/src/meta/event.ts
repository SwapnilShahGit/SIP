
export class Event implements IEvent {
    public id: string;
    public title: string;
    public startDate: Date;
    public endDate: Date;
    public description: string;
    public colour: string = '#33cccc';
    public dow: number[] = [];
    public range: {start, end}[] = [{start: '', end: ''}];
}

export interface IEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    colour: string;
    dow: number[];
    range: {start, end}[];
}
