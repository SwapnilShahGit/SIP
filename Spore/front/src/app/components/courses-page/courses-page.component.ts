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
  private coursesMaster: Array<Course> = [];
  private deleteCourseCode: string = "";
  private searchDialogRequest: string = "";
  private mockedSearchResults: Array<Course> = [];
  private searchResultSelected: string = "";

  public ngOnInit() {
    let lectures: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0)];
    let tutorials: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0), new CourseOption(new Date('1491857951850'), 1)];
    let practicals: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0), new CourseOption(new Date('1491857951850'), 1), new CourseOption(new Date('1491857951850'), 2)];
    let course: Course = new Course(false, 'ABC123', 'Dr. Guy', 'No clue what this is...', null, 0, lectures, 0, tutorials, 0, practicals);
    this.courses.push(course);
    this.mockedSearchResults.push(course);
    let courseMaster = <Course>JSON.parse(JSON.stringify(course));
    this.coursesMaster.push(courseMaster);
    // course = new Course(false, 'CSC309', 'Cool Dude Arnold', 'This is a pretty cool class.', 'csc309faspfsaopfjapas');
    // this.courses.push(course);
    // this.mockedSearchResults.push(course);
    // courseMaster = <Course>JSON.parse(JSON.stringify(course));
    // this.coursesMaster.push(courseMaster);
    // let tutorials1: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0), new CourseOption(new Date('1491857951850'), 1)];
    // let tutorials2: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0), new CourseOption(new Date('1491857951850'), 1)];
    // course = new Course(false, 'MAT111', 'Fuchs', 'This class is also pretty cool.', 'mat111fa124asfpfjapas', 1, tutorials1, 0, tutorials2);
    // this.courses.push(course);
    // courseMaster = <Course>JSON.parse(JSON.stringify(course));
    // this.coursesMaster.push(courseMaster);
    // let lectures1: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0)];
    // let lectures2: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0)];
    // let lectures3: Array<CourseOption> = [new CourseOption(new Date('1491857951850'), 0)];
    // course = new Course(false, 'ECO101', 'Bailey on Ice', 'Smooth as hell.', 'eco101ffas2aspfsaopfjapas', 0, lectures1, 0, lectures2, 0, lectures3);
    // this.courses.push(course);
    // courseMaster = <Course>JSON.parse(JSON.stringify(course));
    // this.coursesMaster.push(courseMaster);
  }

  private updateCourse(course: Course): any {
    console.log('Course Update Called!');
    console.log(course);
    // API Update Existing Event call here
    let masterCourse = this.coursesMaster.find(c => c.id == course.id);
    this.coursesMaster[this.coursesMaster.indexOf(masterCourse)] = <Course>JSON.parse(JSON.stringify(course));
    let btn = document.getElementById(course.id + "UpdateButton");
    if (!btn.className.includes("disabled")) {
      btn.className += " disabled";
    }
  }

  private saveCourse(course: Course): any {
    console.log('Course Save Called!');
    console.log(course);
    // API Save New Event call here
    course.isDraft = false;
    this.coursesMaster.push(<Course>JSON.parse(JSON.stringify(course)));
  }

  private switchSlide(course: Course): any {
    if (this.currentSlide != course.id) {
      this.currentSlide = course.id;
      let restyleInput = this.restyleInput;
      setTimeout(function() {
        restyleInput("time");
      }, 1);
    } else {
      this.currentSlide = "";
    }
  }

  private restyleInput(className: String): void {
    let startTimeOuter = document.getElementsByClassName(className + "Outer");
      if (startTimeOuter.length > 0) {
        for (var i = 0; i < startTimeOuter.length; i++) {
          let startTimeInput = startTimeOuter[i] as HTMLElement;
          startTimeInput.style.padding = "0px";
          startTimeInput.style.border = "none";
          startTimeInput.style.borderRadius = "4px";
        }
      }

      let startTimeInner = document.getElementsByClassName(className + "Inner");
      if (startTimeInner.length > 0) {
        for (var i = 0; i < startTimeOuter.length; i++) {
          let startTimeInput = startTimeInner[i] as HTMLElement;
          startTimeInput.style.borderRadius = "4px";
        }
      }
  }

  private addCourse(id?: string): any {
    console.log('Add Course Called!');
    let course: Course;
    if (id) {
      course = this.mockedSearchResults.find(c => c.id == id);
    } else {
      course = new Course();
    }
    this.courses.push(course);
    setTimeout(function() {
      let panel = document.getElementById(course.id + 'Toggle');
      let courseField = document.getElementById(course.id + 'Course');
      if (panel) {
        panel.click();
        if (courseField) {
          courseField.focus();
        }
      }
    }, 50)
  }

  private deleteCourse(): any {
    console.log('Delete Course Called!');
    let course = this.courses.find(c => c.id == this.currentSlide);
    if (!course.isDraft) {
      console.log('API Call for delete called!');
      // API Call to delete this course
      // if (!successfulCall) { some error mssg + break; }
    }
    this.courses.splice(this.courses.indexOf(course), 1);
    let courseMaster = this.coursesMaster.find(c => c.id == this.currentSlide);
    this.coursesMaster.splice(this.coursesMaster.indexOf(courseMaster), 1);
  }

  private addCourseOption(course: Course, section: Array<CourseOption>): any {
    console.log('Add Course Option Called!');
    if (section.length < 26) {
      section.push(new CourseOption(new Date('000000000'), section.length));
      let restyleInput = this.restyleInput;
      setTimeout(function() {
        restyleInput("time");
      }, 1);
    }
    this.updateButtonCheck(course);
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
    this.updateButtonCheck(course);
  }

  private updateButtonCheck(course: Course): any {
    console.log('In Update Button Check!');
    let masterCourse = this.coursesMaster.find(c => c.id == course.id);
    let btn = document.getElementById(course.id + "UpdateButton");
    if (btn && btn.className) {
      if (JSON.stringify(masterCourse) !== JSON.stringify(course)) {
        if (btn.className.includes("disabled")) {
          btn.className = btn.className.replace(" disabled", "");
        }
      } else {
        if (!btn.className.includes("disabled")) {
          btn.className += " disabled";
        }
      }
    }
  }

  private openSearch(): any {
    if (this.searchDialogRequest.length > 0) {
      this.searchResultSelected = '';
      document.getElementById('checkButton').click();
    }
  }
}
