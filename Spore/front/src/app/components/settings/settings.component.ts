import { Component, OnInit, Input } from '@angular/core';
import { User, Theme } from '../../../meta/user';
import { SupportedSchoolsEnum } from '../../../meta/SupportedSchools';
import * as _ from 'lodash';
import { DatabaseService } from '../../../meta/database.service';
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
  private avatarEyes: Array<String> = ["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"];
  private avatarEyesIndex: number = Math.floor(Math.random() * 8);
  private avatarNose: Array<String> = ["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];
  private avatarNoseIndex: number = Math.floor(Math.random() * 7);
  private avatarMouth: Array<String> = ["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"];
  private avatarMouthIndex: number = Math.floor(Math.random() * 7);
  private avatarColour: string = '#'+ (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
  private basicColours: Array<String> = ['#ff7373', '#ffd700', '#3399ff', '#00ff00', '#ffa500', '#8a2be2'];

  constructor(
    private databaseService: DatabaseService
  ) {
    this.buildSupportedSchools();
  }

  public ngOnInit() {
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
    this.avatarEyesIndex = Math.floor(Math.random() * 8);
    this.avatarMouthIndex = Math.floor(Math.random() * 7);
    this.avatarNoseIndex = Math.floor(Math.random() * 7);
    this.setAvatar();
  }

  public customPicture(part: string) {
    if (part == 'eyes') {
      if (this.avatarEyesIndex >= 8) {
        this.avatarEyesIndex = 0;
      } else {
        this.avatarEyesIndex++;
      }
    } else if (part == 'nose') {
      if (this.avatarNoseIndex >= 7) {
        this.avatarNoseIndex = 0;
      } else {
        this.avatarNoseIndex++;
      }
    } else if (part == 'mouth') {
      if (this.avatarMouthIndex >= 7) {
        this.avatarMouthIndex = 0;
      } else {
        this.avatarMouthIndex++;
      }
    }

    this.setAvatar();
  }

  public setAvatar() {
    let colour = this.avatarColour.substring(1);
    this.temporaryProfilePicture = this.avatarBaseUrl + 'face/'
      + this.avatarEyes[this.avatarEyesIndex] + '/'
      + this.avatarNose[this.avatarNoseIndex] + '/'
      + this.avatarMouth[this.avatarMouthIndex] + '/'
      + colour;
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
