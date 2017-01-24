import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FBConnector } from '../../../assets/facebook/facebook';
import { User } from '../../../meta/user';
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  private fbKey: string = ENV === 'production' ? '309270582738901' : '346211865751257';

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    zone: NgZone) {
    (<any>window).zoneImpl = zone;
  }

  public ngOnInit() {
    let fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
  }

  public sporeLogin(event: Event) {
    this.router.navigate(['/main-page', 0]);
    console.log('Spore Login');
  }

  public sporeSignUp(event: Event) {
    this.router.navigate(['/sign-up']);
    console.log('Spore Sign Up');
  }

  public facebookLogin(event: Event) {
    let databaseService = this.databaseService;
    let reDir = this.router;

    function checkLogin(response: FB.LoginStatusResponse): void {
      if (response.status === 'connected') {
        console.log('connected');
        let userId = response.authResponse.userID;
        FB.api('/me', { fields: 'last_name,first_name,email,age_range,cover,name,' +
        'link,gender,locale,picture,timezone,updated_time,verified' }, function (response) {
          let user = new User('', response.first_name, response.last_name, '',
            response.email, response.gender, userId, response.picture.data.url, '');
          handleUser(user);
        });
      } else if (response.status === 'unknown') {
        console.log('not logged in, logging in');
        FB.login(checkLogin, { scope: 'public_profile,email,user_friends' });
      } else if (response.status === 'not_authorized') {
        console.log('not authorized');
      }
    }

    function handleUser(user: User) {
      databaseService.getUser(user.FacebookID).then(response => {
        if (response.error !== 0) {
          window.alert('Error: Not Found in Database. Please Sign Up');
        } else {
          redirectUser(user.FacebookID);
        }
      });
    }

    function redirectUser(id: string) {
      (<any>window).zoneImpl.run(() => reDir.navigate(['/main-page', id]));
    }

    FB.getLoginStatus(checkLogin);
  }
}
