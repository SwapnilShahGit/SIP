import { Component, OnInit } from '@angular/core';
import { FBConnector } from '../../../assets/facebook/facebook';
import { Router } from '@angular/router';
import { NavService } from '../../../meta/nav.service';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'static-nav',
  templateUrl: './static-nav.component.html',
  styleUrls: ['./static-nav.component.scss']
})
export class StaticNavBar implements OnInit {

  private fbKey: string = ENV === 'production' ? '309270582738901' : '346211865751257';
  private isNavOpen = true;
  private user: Observable<User>;

  constructor(
    private router: Router,
    private navService: NavService,
    private databaseService: DatabaseService,
    private cookieService: CookieService
  ) { }

  public ngOnInit() {
    this.user = this.databaseService.user;
    let fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
  }

  public closeNav() {
    if (!this.isNavOpen) {
      this.toggleOpenNav();
    }
  }

  public toggleOpenNav() {
    this.navService.toggleNav(this.isNavOpen);
    this.isNavOpen = !this.isNavOpen;
  }

  public facebookLogout() {
    let router = this.router;
    let cookieService = this.cookieService;
    function checkResponse(response: FB.LoginStatusResponse) {
      console.log('status: ' + response.status);
      if (response && response.status === 'connected') {
        FB.logout(checkResponse);
        cookieService.remove('userID');
      } else if (response && response.status === 'unknown') {
        cookieService.remove('userID');
        router.navigate(['/login']);
      } else if (response && response.status === 'not_authorized') {
        cookieService.remove('userID');
        router.navigate(['/login']); // not sure when this is possible...
      }
    }

    FB.getLoginStatus(checkResponse);
  }
}
