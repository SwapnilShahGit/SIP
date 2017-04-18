
export class CourseOption implements ICourseOption {
    public day: string;
    public startTime: Date;
    public endTime: Date;

    constructor(day?: string, startTime?: Date, endTime?: Date) {
      this.day = day;
      this.startTime = startTime;
      this.endTime = endTime;
    }
}

export interface ICourseOption {
    day: string,
    startTime: Date,
    endTime: Date
}
