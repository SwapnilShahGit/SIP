
export class CourseOption implements ICourseOption {
    public times: {day: string, start: Date, end: Date}[] = [];

    constructor(day?: string, startTime?: Date, endTime?: Date) {
      let newDay = day || "Monday";
      let newStartTime = startTime || new Date(1970, 0, 1, new Date().getHours(), 0, 0, 0);
      let newEndTime = endTime || new Date(1970, 0, 1, new Date().getHours(), 0, 0, 0);
      this.times.push({day: newDay, start: newStartTime, end: newEndTime});
    }
}

export interface ICourseOption {

}
