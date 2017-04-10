
export class CourseOption implements ICourseOption {
    public time: Date;
    public index: number;

    constructor(time?: Date, index?: number) {
      // this.time = Date.now();
      this.index = index || 0;
    }
}

export interface ICourseOption {
    time: Date;
    index: number;
}
