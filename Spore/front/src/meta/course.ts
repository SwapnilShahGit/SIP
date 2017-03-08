import { CourseOption } from './courseOption';

export class Course implements ICourse {
    public code: string;
    public instructor: string;
    public description: string;
    public id: string;
    public lectureSelected: number;
    public lectures: Array<CourseOption>;
    public tutorialSelected: number;
    public tutorials: Array<CourseOption>;
    public practicalSelected: number;
    public practicals: Array<CourseOption>;
    public isDraft: boolean = true;

    constructor(isDraft?: boolean, code?: string, instructor?: string,
                description?: string, id?: string,
                lectureSelected?: number, lectures?: Array<CourseOption>,
                tutorialSelected?: number, tutorials?: Array<CourseOption>,
                practicalSelected?: number, practicals?: Array<CourseOption>) {
      this.isDraft = isDraft == undefined ? true : isDraft;
      this.code = code || 'Course Code';
      this.instructor = instructor || 'Instructors Name';
      this.description = description || '';
      this.id = id || Guid.newGuid();
      this.lectureSelected = lectureSelected || 0;
      this.lectures = lectures || [];
      this.tutorialSelected = tutorialSelected || 0;
      this.tutorials = tutorials || [];
      this.practicalSelected = practicalSelected || 0;
      this.practicals = practicals || [];
    }
}

export interface ICourse {
    code: string;
    instructor: string;
    description: string;
    id: string;
    lectureSelected: number;
    lectures: Array<CourseOption>;
    tutorialSelected: number;
    tutorials: Array<CourseOption>;
    practicalSelected: number;
    practicals: Array<CourseOption>;
    isDraft: boolean;
}

class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
