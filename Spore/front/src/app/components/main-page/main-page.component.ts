import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private _leftSlideOut: boolean = false;
  private _rightSlideOut: boolean = false;
  private _notificationsVisible: boolean = true;
  private _notificationCount: number = 0;

  constructor(private _router: Router) {
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

  public navigateToLoginPage() {
    this._router.navigate(['/login']);
  }

  public notifiedUser($event: Event) {
    this._notificationCount += 1;
  }

  public temp() {
    if (this._notificationCount > 9) {
      return '9+';
    }
    return this._notificationCount.toString();
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
