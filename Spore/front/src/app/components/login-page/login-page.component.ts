import { Component, OnInit } from '@angular/core';
import { InfoCardComponent } from '../info-card/info-card.component';
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { Router } from "@angular/router";
import { FBConnector } from '../../../assets/facebook/facebook';
import { Observable } from 'rxjs/Rx';
import { User } from '../../../meta/user';
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  private fbKey: string = ENV == "production" ? "309270582738901" : "346211865751257";

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
  ) { }

  ngOnInit() {
    var fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
  }

  sporeLogin(event: Event) {
    this.router.navigate(['/main-page', 0]);
    console.log('Spore Login');
  }

  sporeSignUp(event: Event) {
    this.router.navigate(['/sign-up']);
    console.log('Spore Sign Up');
  }

  facebookLogin(event: Event) {
    let databaseService = this.databaseService;
    let reDir = this.router;

    function checkLogin(response: FB.LoginStatusResponse): void {
      if (response.status === "connected") {
        console.log("connected");
        let userId = response.authResponse.userID;
        FB.api('/me', { fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified' }, function (response) {
          console.log(response);
          let user = new User(userId, response.first_name, response.last_name, response.picture.data.url);
          handleUser(user);
        });
      } else if (response.status === "unknown") {
        console.log("not logged in, logging in");
        FB.login(checkLogin, { scope: 'public_profile,email,user_friends' });
      } else if (response.status === "not_authorized") {
        console.log("not authorized");
      }
    }

    function handleUser(user: User) {
      databaseService.getUser(user.UserID).then(data => {
        if (data.error != "0") {
          databaseService.addUser(user).then(() => redirectUser(user.UserID));
        } else {
          redirectUser(user.UserID);
        }
      });
    }

    function redirectUser(id: string) {
      reDir.navigate(['/main-page', id]);
      location.reload();            
    }

    FB.getLoginStatus(checkLogin);
  }
}
