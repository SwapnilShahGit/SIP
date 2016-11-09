import { Component, Input, OnInit } from '@angular/core';
import { FBConnector } from '../../../assets/facebook/facebook';
import { Router } from "@angular/router";

@Component({
  selector: 'static-nav',
  templateUrl: './static-nav.component.html',
  styleUrls: ['./static-nav.component.scss']
})
export class StaticNavBar implements OnInit {
  @Input() profileImageLocation: string;

  private _notificationCount: number = 0;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    var fbCon: FBConnector = new FBConnector('309270582738901');
    fbCon.initFB();
    if (this.profileImageLocation == undefined || this.profileImageLocation == '') {
      this.profileImageLocation = 'https://placekitten.com/45/45';
    }
  }

  notifiedUser($event: Event) {
    this._notificationCount += 1;
  }

  numNotifications() {
    if (this._notificationCount > 9) {
      return '9+';
    }
    return this._notificationCount.toString();
  }

  facebookLogout(event: Event) {
    function getLoginStatus(response: FB.LoginStatusResponse) {
      if (response && response.status === 'connected') {
        FB.logout(getLoginStatus);
      }
    }
    FB.logout(getLoginStatus);
    this.router.navigate(['/login']);
  }
}
