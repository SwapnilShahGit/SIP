
export class CourseOption implements ICourseOption {
    public day: string;
    public startTime: Date;
    public endTime: Date;

    constructor(day?: string, startTime?: Date, endTime?: Date) {
      this.day = day || "Monday";
      this.startTime = startTime || new Date(1970, 0, 1, new Date().getHours(), 0, 0, 0);
      this.endTime = endTime || new Date(1970, 0, 1, new Date().getHours(), 0, 0, 0);
    }
}

export interface ICourseOption {
    day: string,
    startTime: Date,
    endTime: Date
}
