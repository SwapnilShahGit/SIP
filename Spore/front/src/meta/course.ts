import { CourseOption } from './courseOption';

export class Course implements ICourse {
    public code: string;
    public instructor: string;
    public description: string;
    public id: string;
    public lectures: Array<CourseOption>;
    public tutorials: Array<CourseOption>;
    public practicals: Array<CourseOption>;
    public isDraft: boolean = true;
    public is_parse: boolean = false;
    public colour: string = '#ffcc66';
    public exams: boolean = true;
    public exam_info: string;
    public office_hours: string;
    public office_location: string;
    public officeHoursInfo: string;

    constructor(isDraft?: boolean, is_parse?: boolean, code?: string, instructor?: string,
                description?: string, id?: string, exams?: boolean, exam_info?: string,
                lectures?: Array<CourseOption>, tutorials?: Array<CourseOption>,
                practicals?: Array<CourseOption>, office_hours?: string,
                office_location?: string, colour?: string, officeHoursInfo?: string, ) {
      this.isDraft = isDraft == undefined ? true : isDraft;
      this.is_parse = is_parse == undefined ? false : is_parse;
      this.code = code || 'Course Code';
      this.instructor = instructor || 'Instructors Name';
      this.description = description || '';
      this.id = id || Guid.newGuid();
      this.exams = exams || true;
      this.exam_info = exam_info || 'No information yet available.';
      this.lectures = lectures || [];
      this.tutorials = tutorials || [];
      this.practicals = practicals || [];
      this.office_hours = office_hours || '';
      this.office_location = office_location || '';
      this.officeHoursInfo = officeHoursInfo || 'No information yet available.';
      this.colour = colour || '#ffcc66';
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
    isDraft: boolean;
    is_parse: boolean;
    colour: string;
    exams: boolean;
    exam_info: string;
    office_hours: string;
    office_location: string;
    officeHoursInfo: string;
}

class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
