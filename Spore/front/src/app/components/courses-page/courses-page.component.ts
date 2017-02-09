import { Component } from '@angular/core';

@Component({
  selector: 'courses-page',
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.scss']
})

export class CoursesPageComponent {

  private courses: Array<any> =
  [
    {
      code: "CSC309",
      instructor: "Arnold",
      description: "This is a pretty cool class.",
      id: "csc309"
    },
    {
      code: "MAT111",
      instructor: "Fuchs",
      description: "This class is also pretty cool.",
      id: "mat111"
    },
    {
      code: "ECO101",
      instructor: "Bailey",
      description: "Now this... Is the best class there is.",
      id: "eco101"
    }
  ];

}
