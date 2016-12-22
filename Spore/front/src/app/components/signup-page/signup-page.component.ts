import {Component, OnInit, NgZone} from '@angular/core';
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
  private apiResponse = {userId: '', first_name: '', last_name: '', email: '', dateOfBirth: '', selectedSchool: '', male: '', female: '', pictureUrl: ''};
  private disabledField = 'inherit';

  constructor(private router: Router, private databaseService: DatabaseService, public zone: NgZone){
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

    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log('connected');
        let userId = response.authResponse.userID;
        FB.api('/me', {fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified,education,birthday'}, (response) => {
          console.log(response);
          this.buildUIResponseObject(response);
        });
      } else if (response.status === 'unknown') {
        console.log('not logged in, loggin in');
        FB.login((response) => {
          if (response.status === 'connected') {
            let userId = response.authResponse.userID;
            FB.api('/me', {fields: 'last_name,first_name,email,age_range,cover,name,link,gender,locale,picture,timezone,updated_time,verified,education,birthday'}, (response) => {
              console.log(response);
              this.buildUIResponseObject(response);
            });
          }
        }, {scope: 'public_profile,email,user_friends,user_education_history, user_birthday'});
      } else if (response.status === 'not_authorized') {
        console.log('not authorized');
      }
    });

  }

  public buildUIResponseObject(response) {
    this.zone.run(() => {
      this.apiResponse.userId = response.id;
      this.apiResponse.first_name = response.first_name;
      this.apiResponse.last_name = response.last_name;
      this.apiResponse.email = response.email;
      this.apiResponse.dateOfBirth = response.birthday;
      this.apiResponse.pictureUrl = response.picture.data.url;

      let userSchools = response.education;
      let i;
      for (i = 0; i <= userSchools.length; i ++) {
        if(userSchools[i]) {
          if (userSchools[i].type === 'College') {
            this.apiResponse.selectedSchool = userSchools[i].school.name;
          }
        }
      }
      if (this.supportedSchools.indexOf(this.apiResponse.selectedSchool) === -1) {
        this.apiResponse.selectedSchool = 'Other';
      }

      if (response.gender === 'male') {
        this.apiResponse.male = 'checked';
        this.apiResponse.female = '';
      } else if (response.gender === 'female') {
        this.apiResponse.female = 'checked';
        this.apiResponse.male = '';
      }

      this.disabledField = 'none';
    });
  }

  public buildSupportedSchools() {
    this.supportedSchools = ['-'];
    for (var i = 0; i < _.flatMap(SupportedSchoolsEnum).length /2 ; i ++) {
      this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
    }
  }

  public signUpUser() {
    console.log('sign up user');
    let newUser = new User(this.apiResponse.userId, this.apiResponse.first_name, this.apiResponse.last_name, this.apiResponse.email, this.apiResponse.pictureUrl);
    this.databaseService.addUser(newUser).then(() => {
      window.alert('User added');
    });
  }
}
