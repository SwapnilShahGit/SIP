import { Component, OnInit, Input } from '@angular/core';
import { User, Theme } from '../../../meta/user';
import { SupportedSchoolsEnum } from '../../../meta/SupportedSchools';
import * as _ from 'lodash';
import { DatabaseService } from '../../../meta/database.service';
import { UserService } from '../../../meta/user.service'
import { FBConnector } from '../../../assets/facebook/facebook';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Input()
  public user: User;

  private fbKey: string = ENV == "production" ? "309270582738901" : "346211865751257";
  private avatarBaseUrl: string = "https://api.adorable.io/avatars/";
  private supportedSchools: any[];
  private successDisplay: string = 'none';
  private successOpacity: string = '1';
  private temporaryProfilePicture: string = '';
  // private avatarColour: string;

  constructor(
    private databaseService: DatabaseService,
    private userService: UserService
  ) {
    this.buildSupportedSchools();
  }

  public ngOnInit() {
    // this.avatarColour = this.userService.getColour();
    var fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
  }

  public buildSupportedSchools() {
    this.supportedSchools = ['-'];
    for (var i = 0; i < _.flatMap(SupportedSchoolsEnum).length / 2; i++) {
      this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
    }
  }

  public updateUser() {
    this.closeAlert(true);
    let tempUser = this.user;
    if (this.temporaryProfilePicture == '' || this.temporaryProfilePicture == this.user.pictureURL) {
      tempUser.pictureURL = this.user.pictureURL;
    } else {
      tempUser.pictureURL = this.temporaryProfilePicture;
    }

    tempUser.theme = this.user.theme;
    this.databaseService.updateUser(tempUser).then(response => {
      if (response.error != '0') {
        window.alert('Error occured during update API call: ' + response.data);
      } else {
        this.user = tempUser;
        this.successDisplay = '';
        this.successOpacity = '1';
      }
    });
  }

  public closeAlert(force: boolean) {
    this.successOpacity = '0';
    if (force) {
      this.successDisplay = 'none';
    } else {
      setTimeout(() => {
        this.successDisplay = 'none';
      }, 600);
    }
  }

  public randomizePicture() {
    let url = this.userService.getRandomPicture();
    this.setAvatar(url);
    // this.avatarColour = this.userService.getColour();
  }

  public customPicture(part: string) {
    // this.userService.setAvatarColour(this.avatarColour);
    let url = this.userService.nextProfilePictureByPart(part);
    this.setAvatar(url);
  }

  public setAvatar(url: string) {
    this.temporaryProfilePicture = url;
  }

  public setFacebookPicture() {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        FB.api('/me/picture?width=250&height=250', (response) => this.setPicture(response));
      } else if (response.status === 'unknown') {
        FB.login((response) => {
          if (response.status === 'connected') {
            FB.api('/me/picture?width=250&height=250', (response) => this.setPicture(response));
          }
        });
      }
    });
  }

  public setPicture(response) {
    if (this.temporaryProfilePicture != response.data.url && this.temporaryProfilePicture != '') {
      this.temporaryProfilePicture = response.data.url;
    }
  }

}
