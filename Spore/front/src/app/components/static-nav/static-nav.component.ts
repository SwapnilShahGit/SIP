/**
 * Created by anatale on 10/28/2016.
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'static-nav',
  templateUrl: './static-nav.component.html',
  styleUrls: ['./static-nav.component.scss']
})
export class StaticNavBar implements OnInit {
  @Input() profileImageLocation:string;

  private _notificationCount: number = 0;

  ngOnInit() {
    if(this.profileImageLocation == undefined || this.profileImageLocation == '') {
      this.profileImageLocation = 'https://placekitten.com/45/45';
    }
  }

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
