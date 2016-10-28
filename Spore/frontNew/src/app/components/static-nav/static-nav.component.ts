/**
 * Created by anatale on 10/28/2016.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'static-nav',
  templateUrl: './static-nav.component.html',
  styleUrls: ['./static-nav.component.css']
})
export class StaticNavBar {

  private _notificationCount: number = 0;

  public notifiedUser($event: Event) {
    this._notificationCount += 1;
  }

  public numNotifications() {
    if (this._notificationCount > 9) {
      return '9+';
    }
    return this._notificationCount.toString();
  }
}
