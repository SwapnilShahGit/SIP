import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-static-bar',
  templateUrl: 'static-bar.component.html',
  styleUrls: ['static-bar.component.css']
})
export class StaticBarComponent implements OnInit {

  text: string;

  constructor() { }

  ngOnInit() {
  }

}
