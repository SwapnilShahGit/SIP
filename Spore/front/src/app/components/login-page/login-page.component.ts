import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FBConnector } from '../../../assets/facebook/facebook';
import { User } from '../../../meta/user';
import { DatabaseService } from '../../../meta/database.service';
import { CookieService } from 'angular2-cookie/core';
import { ColourThemes } from '../../../meta/ColourThemesLogin.ts';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  private fbKey: string = ENV === 'production' ? '309270582738901' : '346211865751257';
  private topLeftColour = '#ff7373';
  private bottomRightColour = '#ffd700';
  private gradient = 'linear-gradient(to bottom right, #ff7373, #ffd700)';
  private fontColour = '#337ab7';
  private email: string = '';
  private password: string = '';

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private cookieService: CookieService,
    zone: NgZone) {
    (<any>window).zoneImpl = zone;
  }

  public ngOnInit() {
    let theme = Math.floor(Math.random() * ColourThemes.length);
    this.topLeftColour  = ColourThemes[theme].primaryColour;
    this.bottomRightColour = ColourThemes[theme].secondaryColour;
    this.gradient = 'linear-gradient(to bottom right, ' + this.topLeftColour + ', ' + this.bottomRightColour + ')';
    this.fontColour = ColourThemes[theme].fontColour;
    let fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
    if (this.cookieService.get('userID')) {
      this.router.navigate(['/main-page']);
    }
  }

  public sporeLogin(event: Event) {
    if (this.email.length === 0 || this.password.length === 0) {
      window.alert('Error: Please fill all fields');
      return;
    }
    this.databaseService.getUserFromEmailPassword(this.email, this.password).then(response => {
      if (response.error !== 0) {
        window.alert('Error: Please try again');
      } else {
        this.cookieService.put('userID', response.data._id);
        this.router.navigate(['/main-page']);
      }
    });
  }

  public sporeSignUp(event: Event) {
    this.router.navigate(['/sign-up']);
    console.log('Spore Sign Up');
  }

  public facebookLogin(event: Event) {
    let databaseService = this.databaseService;
    let reDir = this.router;
    let cookieService = this.cookieService;

    function checkLogin(response: FB.LoginStatusResponse): void {
      if (response.status === 'connected') {
        console.log('connected');
        let userId = response.authResponse.userID;
        FB.api('/me', { fields: 'last_name,first_name,email,age_range,cover,name,' +
        'link,gender,locale,picture,timezone,updated_time,verified' }, function (response) {
          let user = new User('', response.first_name, response.last_name, '',
            response.email, userId, response.picture.data.url, '');
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
      databaseService.getUserFromFacebookID(user.facebookID).then(response => {
        if (response.error !== 0) {
          window.alert('Error: Not Found in Database. Please Sign Up');
          reDir.navigate(['/sign-up']);
        } else {
          cookieService.put('userID', response.data._id);
          redirectUser(user.facebookID);
        }
      });
    }

    function redirectUser(id: string) {
      (<any>window).zoneImpl.run(() => reDir.navigate(['/main-page']));
    }

    FB.getLoginStatus(checkLogin);
  }
}
