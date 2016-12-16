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

  public supportedSchools;
  private fbKey: string = ENV == "production" ? "309270582738901" : "346211865751257";
  private temp = {first_name: '', last_name: '', email: ''};
  private value;
  private disabledField = false;
  private selectedSchool = '-';

  constructor(private router: Router, private databaseService: DatabaseService){
    this.buildSupportedSchools();
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

    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('connected');
        let userId = response.authResponse.userID;
        FB.api('/me', {fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified,education,birthday'}, (response) => {
          console.log(response);
          this.temp = response;
          this.value = response.birthday;
          this.disabledField = true;
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
              this.disabledField = true;
              this.selectedSchool = 'University of Toronto St. George';
              if (this.supportedSchools.indexOf(this.selectedSchool) === -1) {
                this.selectedSchool = 'Other';
              }
            });
          }
        }, {scope: 'public_profile,email,user_friends,user_education_history, user_birthday'});
      } else if (response.status === 'not_authorized') {
        console.log('not authorized');
      }
    });

  }

  public buildSupportedSchools() {
    this.supportedSchools = ['-'];
    for (var i = 0; i < _.flatMap(SupportedSchoolsEnum).length /2 ; i ++) {
      this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
    }
  }
}
