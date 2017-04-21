import { Component, OnInit } from '@angular/core';
import { Course } from '../../../meta/course';
import { CourseOption } from '../../../meta/courseOption';
import { DatabaseService } from '../../../meta/database.service';
import { CookieService } from 'angular2-cookie/core';

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
  private userID: string;

  constructor (
    private databaseService: DatabaseService,
    private cookieService: CookieService
  ) { }

  public ngOnInit() {
    if (this.cookieService.get('userID')) {
      this.userID = this.cookieService.get('userID');
      this.databaseService.getUserCourses(this.userID).then(response => {
        if (response.error === 0) {
          this.courses = response.data;
          this.coursesMaster = response.data;
        } else {
          console.log('Error during course population: ' + response.data);
        }
      });
    }
    // let lectures: Array<CourseOption> = [new CourseOption()];
    // let tutorials: Array<CourseOption> = [new CourseOption()];
    // let practicals: Array<CourseOption> = [new CourseOption(), new CourseOption()];
    // let officeHours: Array<CourseOption> = [new CourseOption()];
    // let course: Course = new Course(false, 'ABC123', 'Dr. Guy', 'No clue what this is...', null, true, "Exam will be held in IB 110 at 3:00pm until 5:00pm", lectures, tutorials, practicals, officeHours);
    // this.courses.push(course);
    // this.mockedSearchResults.push(course);
    // let courseMaster = <Course>JSON.parse(JSON.stringify(course));
    // this.coursesMaster.push(courseMaster);
  }

  private updateCourse(course: Course): any {
    console.log('Course Update Called!');
    console.log(course);
    // API Update Existing Event call here
    this.databaseService.updateCourse(this.userID, course).then(response => {
      console.log('USER COURSES UPDATE: ' + response);
      if (response.error === 0) {
        //course updated, response.data should be the updated fields...?!
      } else {
        console.log('Error during course update: ' + response.data);
      }
    });

    // let masterCourse = this.coursesMaster.find(c => c.id == course.id);
    // this.coursesMaster[this.coursesMaster.indexOf(masterCourse)] = <Course>JSON.parse(JSON.stringify(course));
    // let btn = document.getElementById(course.id + "UpdateButton");
    // if (!btn.className.includes("disabled")) {
    //   btn.className += " disabled";
    // }
  }

  private saveCourse(course: Course): any {
    console.log('Course Save Called!');
    console.log(course);
    // API Save New Event call here
    this.databaseService.addCourse(this.userID, course).then(response => {
      console.log('USER COURSES ADD: ' + response);
      if (response.error === 0) {
        //course added, response.data should be the course object!
      } else {
        console.log('Error during course addition: ' + response.data);
      }
    });

    // course.isDraft = false;
    // this.coursesMaster.push(<Course>JSON.parse(JSON.stringify(course)));
  }

  private switchSlide(course: Course): any {
    if (this.currentSlide != course.id) {
      this.currentSlide = course.id;
    } else {
      this.currentSlide = "";
    }
  }

  private addCourse(id?: string): any {
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
      this.databaseService.deleteCourse(this.userID, course).then(response => {
        console.log('USER COURSES DELETE: ' + response);
        // 200 = good, 404 = bad ...???
      });
    }

    // this.courses.splice(this.courses.indexOf(course), 1);
    // let courseMaster = this.coursesMaster.find(c => c.id == this.currentSlide);
    // this.coursesMaster.splice(this.coursesMaster.indexOf(courseMaster), 1);
  }

  private addCourseOption(course: Course, section: Array<CourseOption>): any {
    console.log('Add Course Option Called!');
    if (section.length < 5) {
      section.push(new CourseOption());
    }
    this.updateButtonCheck(course);
  }

  private removeCourseOption(course: Course, section: Array<CourseOption>, type: string): any {
    console.log('Remove Course Option Called!');
    section.pop();
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

  private toggleSwitch(course: Course): any {
    course.examNotifications = !course.examNotifications;
    this.updateButtonCheck(course);
  }
}
