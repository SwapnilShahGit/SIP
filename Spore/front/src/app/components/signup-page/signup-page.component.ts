import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {SupportedSchoolsEnum} from '../../../meta/SupportedSchools';
import { FBConnector } from '../../../assets/facebook/facebook';
import { Observable } from 'rxjs/Rx';
import {User} from "../../../meta/user";
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignUpPageComponent implements OnInit{

  public supportedSchools = [];
  private fbKey: string = ENV == "production" ? "309270582738901" : "346211865751257";
  private temp = {first_name: '', last_name: '', email: ''};
  private value;

  constructor(private router: Router, private databaseService: DatabaseService){
    this.supportedSchools.push('-');
    for(var i = 0; i < _.flatMap(SupportedSchoolsEnum).length /2 ; i ++) {
      this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
    }
  }

  public ngOnInit() {
    var fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
  }

  sporeLogin(event: Event) {
    this.router.navigate(['/login']);
    console.log('Back to login');
  }

  public facebookLogin() {

    let databaseService = this.databaseService;
    let temp = this.temp;

    /*function checkLogin(response: FB.LoginStatusResponse): void {
      if (response.status === "connected") {
        console.log("connected");
        let userId = response.authResponse.userID;
        FB.api('/me', { fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified,education' }, function (response) {
          console.log(response);
          temp = Observable.of(response);
          let user = new User(userId, response.first_name, response.last_name, response.picture.data.url);
          handleUser(user);
        });
      } else if (response.status === "unknown") {
        console.log("not logged in, logging in");
        FB.login(checkLogin, { scope: 'public_profile,email,user_friends,user_education_history,' });
      } else if (response.status === "not_authorized") {
        console.log("not authorized");
      }
    }

    function handleUser(user: User) {
      databaseService.getUser(user.UserID).then(data => {
        if (data.error != "0") {
          console.log(user);
        }
      });
    }*/

    //FB.getLoginStatus(checkLogin);
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('connected');
        let userId = response.authResponse.userID;
        FB.api('/me', {fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified,education,birthday'}, (response) => {
          console.log(response);
          this.temp = response;
          this.value = response.birthday;
        });
      } else if (response.status === 'unknown') {
        console.log('not logged in, loggin in');
        FB.login((response) => {
          if (response.status === 'connected') {
            let userId = response.authResponse.userID;
            FB.api('/me', {fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified,education,birthday'}, (response) => {
              console.log(response);
              this.temp = response;
              this.value = response.birthday;
            });
          }
        }, {scope: 'public_profile,email,user_friends,user_education_history, user_birthday'});
      } else if (response.status === 'not_authorized') {
        console.log('not authorized');
      }
    });

  }
}
