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
          for (var i = 0; i < response.data.length; i++) {
            this.cleanUpCourse(response.data[i]);
          }

          this.courses = response.data;
          this.coursesMaster = JSON.parse(JSON.stringify(this.courses));
        } else {
          console.log('Error during course population: ' + response.data);
        }
      });
    }
  }

  private saveCourse(course: Course): any {
    this.databaseService.addCourse(this.userID, course).then(response => {
      if (response.error === 0) {
        this.cleanUpCourse(response.data);
        this.courses.splice(this.courses.indexOf(course), 1);
        let courseMaster = this.coursesMaster.find(c => c.id == course.id);
        this.coursesMaster.splice(this.coursesMaster.indexOf(courseMaster), 1);
        this.courses.push(response.data);
        this.coursesMaster.push(<Course>JSON.parse(JSON.stringify(response.data)));
        setTimeout(function() {
          let panel = document.getElementById(response.data.id + 'Toggle');
          this.currentSlide = response.data.id;
          if (panel) {
            panel.click();
          }
        }, 50);
      } else {
        console.log('Error during course addition: ' + response.data);
      }
    });
  }

  private updateCourse(course: Course): any {
    this.databaseService.updateCourse(course).then(response => {
      if (response.error === 0) {
        this.cleanUpCourse(response.data);
        this.courses.splice(this.courses.indexOf(course), 1);
        let courseMaster = this.coursesMaster.find(c => c.id == course.id);
        this.coursesMaster.splice(this.coursesMaster.indexOf(courseMaster), 1);
        this.courses.push(response.data);
        this.coursesMaster.push(<Course>JSON.parse(JSON.stringify(response.data)));

        // TODO call is broken, update does not return the correct object.

        setTimeout(function() {
          let panel = document.getElementById(response.data.id + 'Toggle');
          this.currentSlide = response.data.id;
          if (panel) {
            panel.click();
          }
        }, 50);
      } else {
        console.log('Error during course update: ' + response.data);
      }
    });
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
    }, 50);
  }

  private deleteCourse(): any {
    let course = this.courses.find(c => c.id == this.currentSlide);
    if (!course.isDraft) {
      this.databaseService.deleteCourse(this.userID, course).then(response => {
        // TODO - this seems to be broken by backend. (returns 404 on successful deletion?)
      });
    }

    // TODO For now I remove the course regardless of above API call... fix later!
    this.courses.splice(this.courses.indexOf(course), 1);
    let courseMaster = this.coursesMaster.find(c => c.id == this.currentSlide);
    this.coursesMaster.splice(this.coursesMaster.indexOf(courseMaster), 1);
  }

  private addCourseOption(course: Course, section: Array<CourseOption>): any {
    if (section.length < 5) {
      section.push(new CourseOption());
    }
    this.updateButtonCheck(course);
  }

  private removeCourseOption(course: Course, section: Array<CourseOption>, type: string): any {
    section.pop();
    this.updateButtonCheck(course);
  }

  private updateButtonCheck(course: Course): any {
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
    course.exams = !course.exams;
    this.updateButtonCheck(course);
  }

  private cleanUpCourse(course: any) {
    course.id = course._id;
    if (course.lectures) {
      for (var j = 0; j < course.lectures.length; j++) {
        course.lectures[j].startTime = new Date(course.lectures[j].startTime);
        course.lectures[j].endTime = new Date(course.lectures[j].endTime);
      }
    } else {
      course.lectures = Array<CourseOption>();
    }

    if (course.tutorials) {
      for (j = 0; j < course.tutorials.length; j++) {
        course.tutorials[j].startTime = new Date(course.tutorials[j].startTime);
        course.tutorials[j].endTime = new Date(course.tutorials[j].endTime);
      }
    } else {
      course.tutorials = Array<CourseOption>();
    }

    if (course.practicals) {
      for (j = 0; j < course.practicals.length; j++) {
        course.practicals[j].startTime = new Date(course.practicals[j].startTime);
        course.practicals[j].endTime = new Date(course.practicals[j].endTime);
      }
    } else {
      course.practicals = Array<CourseOption>();
    }
  }
}
