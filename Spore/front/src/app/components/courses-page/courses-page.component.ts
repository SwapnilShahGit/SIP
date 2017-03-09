import { Component, OnInit } from '@angular/core';
import { Course } from '../../../meta/course';
import { CourseOption } from '../../../meta/courseOption';

@Component({
  selector: 'courses-page',
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.scss']
})

export class CoursesPageComponent implements OnInit {

  private currentSlide: string = "";
  private courses: Array<Course> = [];

  public ngOnInit() {
    var lectures: Array<CourseOption> = [new CourseOption('A', '1pm', 0)];
    var tutorials: Array<CourseOption> = [new CourseOption('A', '1pm', 0), new CourseOption('B', '2pm', 1)];
    var practicals: Array<CourseOption> = [new CourseOption('A', '1pm', 0), new CourseOption('B', '2pm', 1), new CourseOption('C', '3pm', 2)];
    var course: Course = new Course(false, 'ABC123', 'Dr. Guy', 'No clue what this is...', null, 0, lectures, 0, tutorials, 0, practicals);
    this.courses.push(course);
    course = new Course(false, 'CSC309', 'Cool Dude Arnold', 'This is a pretty cool class.', 'csc309faspfsaopfjapas');
    this.courses.push(course);
    var tutorials1: Array<CourseOption> = [new CourseOption('A', '1pm', 0), new CourseOption('B', '2pm', 1)];
    var tutorials2: Array<CourseOption> = [new CourseOption('A', '1pm', 0), new CourseOption('B', '2pm', 1)];
    course = new Course(false, 'MAT111', 'Fuchs', 'This class is also pretty cool.', 'mat111fa124asfpfjapas', 1, tutorials1, 0, tutorials2);
    this.courses.push(course);
    var lectures1: Array<CourseOption> = [new CourseOption('A', '1pm', 0)];
    var lectures2: Array<CourseOption> = [new CourseOption('A', '2pm', 0)];
    var lectures3: Array<CourseOption> = [new CourseOption('A', '3pm', 0)];
    course = new Course(false, 'ECO101', 'Bailey on Ice', 'Smooth as hell.', 'eco101ffas2aspfsaopfjapas', 0, lectures1, 0, lectures2, 0, lectures3);
    this.courses.push(course);
  }

  private updateCourse(course: Course): any {
    console.log('Course Update Called!');
    console.log(course);
    // API Update Existing Event call here
  }

  private saveCourse(course: Course): any {
    console.log('Course Save Called!');
    console.log(course);
    // API Save New Event call here
    course.isDraft = false;
  }

  private switchSlide(course: Course): any {
    if (this.currentSlide != course.id) {
      this.currentSlide = course.id;
    } else {
      this.currentSlide = "";
    }
  }

  private addCourse(): any {
    console.log('Add Course Called!');
    var course: Course = new Course();
    this.courses.push(course);
  }

  private deleteCourse(course: Course): any {
    console.log('Delete Course Called!');
    if (!course.isDraft) {
      console.log('API Call for delete called!');
      // API Call to delete this course
      // if (!successfulCall) { some error mssg + break; }
    }
    this.courses.splice(this.courses.indexOf(course), 1);
  }

  private addCourseOption(section: Array<CourseOption>): any {
    console.log('Add Course Option Called!');
    if (section.length < 26) {
      section.push(new CourseOption("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(section.length), Date.now().toString(), section.length));
    }
  }

  private removeCourseOption(course: Course, section: Array<CourseOption>, type: string): any {
    console.log('Remove Course Option Called!');
    section.pop();
    if (section.length) {
      switch (type) {
        case "Lecture":
          if (course.lectureSelected >= section.length) {
            course.lectureSelected = section.length - 1;
          }
          break;
        case "Tutorial":
          if (course.tutorialSelected >= section.length) {
            course.tutorialSelected = section.length - 1;
          }
          break;
        case "Practical":
          if (course.practicalSelected >= section.length) {
            course.practicalSelected = section.length - 1;
          }
          break;
        default:
          break;
      }
    }
  }
}
