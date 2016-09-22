import {Component, OnInit} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-spore-main-page',
  templateUrl: 'spore-main-page.component.html',
  styleUrls: ['spore-main-page.component.css']
})

export class SporeMainPageComponent implements OnInit {

  private _leftSlideOut: boolean = false;
  private _rightSlideOut: boolean = false;
  private _notificationsVisible: boolean = true;

  constructor() {
  }

  events: any[];

  ngOnInit() {
      this.events = [
        {
          "title": "All Day Event",
          "start": "2016-01-01"
        },
        {
          "title": "Long Event",
          "start": "2016-01-07",
          "end": "2016-01-10"
        }
      ]
  }

  public setLeftSlide(): string {
    return this._leftSlideOut ? 'visible' : 'hidden';
  }

  public setLeftDownSlide(): string {
    return this._leftSlideOut ? 'hidden' : 'visible';
  }

  public setRightSlide(): string {
    return this._rightSlideOut ? 'visible' : 'hidden';
  }

  public setRightDownSlide(): string {
    return this._rightSlideOut ? 'hidden': 'visible';
  }

  public leftSlideButton() {
    this._leftSlideOut = ! this._leftSlideOut;
  }

  public rightSlideButton() {
    this._rightSlideOut = ! this._rightSlideOut;
  }

  public setNotificationsVisibility() {
    this._notificationsVisible = ! this._notificationsVisible;
  }

  public notificationsVisibility(): string {
    return this._notificationsVisible ? 'visible' : 'hidden';
  }
}
