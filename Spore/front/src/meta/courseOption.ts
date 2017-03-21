
export class CourseOption implements ICourseOption {
    public label: string;
    public time: string;
    public index: number;

    constructor(label?: string, time?: string, index?: number) {
      this.label = label || '' ;
      this.time = time || '';
      this.index = index || 0;
    }
}

export interface ICourseOption {
    label: string;
    time: string; // Change to Date object later on...
    index: number;
}
