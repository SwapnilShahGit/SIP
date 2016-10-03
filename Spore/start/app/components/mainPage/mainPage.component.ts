import { Component, OnInit } from 'angular2/core';
import { LoginPageComponent } from '../loginPage/loginPage.component';
import { FooterComponent } from '../footer/footer.component';
import { ScheduleModule } from 'primeng/primeng'; //this doesnt work when you add it as a directive...


@Component({
  selector: 'main-page',
  templateUrl: './app/components/mainPage/mainPage.component.html',
  styleUrls: ['./app/components/mainPage/mainPage.component.css'],
  directives: [LoginPageComponent, FooterComponent]
})

export class MainPageComponent implements OnInit {

  private _leftSlideOut: boolean = false;
  private _rightSlideOut: boolean = false;
  private _notificationsVisible: boolean = true;
  private _notificationCount: number = 0;
  private _events = [
            {
                "title": "All Day Event",
                "start": "2016-01-01"
            },
            {
                "title": "Long Event",
                "start": "2016-01-07",
                "end": "2016-01-10"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2016-01-11",
                "end": "2016-01-13"
            }
        ];

  ngOnInit() { }

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