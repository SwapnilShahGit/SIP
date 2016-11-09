import { Component, OnInit } from '@angular/core';
import { InfoCardComponent } from '../info-card/info-card.component';
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { Router } from "@angular/router";
import { FBConnector } from '../../../assets/facebook/facebook';


import { User } from '../../../meta/User';
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private router: Router,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    var fbCon: FBConnector = new FBConnector('309270582738901');
    fbCon.initFB();
  }

  sporeLogin(event: Event) {
    this.router.navigate(['/main-page', 0]);
    console.log('Spore Login');
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
          let user = new User(userId, response);
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
        if (data === undefined) {
          addUser(user);
        } else {
          redirectUser(user.UserID);
        }
      });
    }

    function redirectUser(id: string) {
      reDir.navigate(['/main-page', id]);
    }

    function addUser(user: User) {
      databaseService.addUser(user).then(() => redirectUser(user.UserID));
    }

    FB.getLoginStatus(checkLogin);
  }
}