import { Component } from '@angular/core';

@Component({
  selector: 'courses-page',
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.scss']
})

export class CoursesPageComponent {

  private currentSlide: string = "";
  private courses: Array<any> =
  [
    {
      code: "CSC309",
      instructor: "Arnold",
      description: "This is a pretty cool class.",
      id: "csc309",
      lectureSelected: 1,
      lectures: [
        {
          label: "A",
          time: "2017-01-14T14:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T16:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T18:00:00-04:00",
          index: 2
        }
      ],
      tutorialSelected: 2,
      tutorials: [
        {
          label: "A",
          time: "2017-01-14T15:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T16:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T19:00:00-04:00",
          index: 2
        }
      ],
      practicalSelected: 0,
      practicals: [
        {
          label: "A",
          time: "2017-01-14T16:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T17:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T20:00:00-04:00",
          index: 2
        }
      ]
    },
    {
      code: "MAT111",
      instructor: "Fuchs",
      description: "This class is also pretty cool.",
      id: "mat111",
      lectureSelected: 1,
      lectures: [
        {
          label: "A",
          time: "2017-01-14T14:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T16:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T18:00:00-04:00",
          index: 2
        }
      ],
      tutorialSelected: 2,
      tutorials: [
        {
          label: "A",
          time: "2017-01-14T15:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T16:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T19:00:00-04:00",
          index: 2
        }
      ],
      practicalSelected: 0,
      practicals: [
        {
          label: "A",
          time: "2017-01-14T16:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T17:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T20:00:00-04:00",
          index: 2
        }
      ]
    },
    {
      code: "ECO101",
      instructor: "Bailey",
      description: "Now this... Is the best class there is.",
      id: "eco101",
      lectureSelected: 1,
      lectures: [
        {
          label: "A",
          time: "2017-01-14T14:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T16:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T18:00:00-04:00",
          index: 2
        }
      ],
      tutorialSelected: 2,
      tutorials: [
        {
          label: "A",
          time: "2017-01-14T15:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T16:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T19:00:00-04:00",
          index: 2
        }
      ],
      practicalSelected: 0,
      practicals: [
        {
          label: "A",
          time: "2017-01-14T16:00:00-04:00",
          index: 0
        },
        {
          label: "B",
          time: "2017-01-12T17:00:00-04:00",
          index: 1
        },
        {
          label: "C",
          time: "2017-01-15T20:00:00-04:00",
          index: 2
        }
      ]
    }
  ];

  private updateCourse(course: any): any {
    console.log('Course Update Called!');
    console.log(course);
    // API call here
  }

  private switchSlide(course: any): any {
    if (this.currentSlide != course.id) {
      this.currentSlide = course.id;
    } else {
      this.currentSlide = "";
    }
  }
}
