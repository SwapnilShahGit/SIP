import { Component, OnInit } from 'angular2/core';
import { LoginPageComponent } from '../loginPage/loginPage.component';
import { FooterComponent } from '../footer/footer.component';


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