import { CourseOption } from './courseOption';

export class Course implements ICourse {
    public code: string;
    public instructor: string;
    public description: string;
    public id: string;
    public lectures: Array<CourseOption>;
    public tutorials: Array<CourseOption>;
    public practicals: Array<CourseOption>;
    public officeHours: Array<CourseOption>;
    public isDraft: boolean = true;
    public colour: string = '#F1AE03';
    public examNotifications: boolean = true;
    public examInfo: string;

    constructor(isDraft?: boolean, code?: string, instructor?: string,
                description?: string, id?: string, examNotification?: boolean, examInfo?: string,
                lectures?: Array<CourseOption>, tutorials?: Array<CourseOption>,
                practicals?: Array<CourseOption>, officeHours?: Array<CourseOption>) {
      this.isDraft = isDraft == undefined ? true : isDraft;
      this.code = code || 'Course Code';
      this.instructor = instructor || 'Instructors Name';
      this.description = description || '';
      this.id = id || Guid.newGuid();
      this.examNotifications = examNotification || true;
      this.examInfo = examInfo || "No results yet available.";
      this.lectures = lectures || [];
      this.tutorials = tutorials || [];
      this.practicals = practicals || [];
      this.officeHours = officeHours || [];
    }
}

export interface ICourse {
    code: string;
    instructor: string;
    description: string;
    id: string;
    lectures: Array<CourseOption>;
    tutorials: Array<CourseOption>;
    practicals: Array<CourseOption>;
    officeHours: Array<CourseOption>;
    isDraft: boolean;
    colour: string;
    examNotifications: boolean;
    examInfo: string;
}

class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
