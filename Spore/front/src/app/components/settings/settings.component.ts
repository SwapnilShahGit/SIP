import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../meta/user';
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

  @Input() user: User;

  private fbKey: string = ENV == "production" ? "309270582738901" : "346211865751257";
  private avatarBaseUrl: string = "https://api.adorable.io/avatars/";
  private supportedSchools: any[];
  private checkedGender = { male: '', female: '' };
  private successDisplay: string = 'none';
  private successOpacity: string = '1';
  private temporaryProfilePicture: string = '';
  private pictureOpacity: string = '0.0';
  private avatarEyes: Array<String> = ["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"];
  private avatarEyesIndex: number = Math.floor(Math.random() * 8);
  private avatarNose: Array<String> = ["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"];
  private avatarNoseIndex: number = Math.floor(Math.random() * 7);
  private avatarMouth: Array<String> = ["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"];
  private avatarMouthIndex: number = Math.floor(Math.random() * 7);
  private avatarColour: string = "#ffbbcc";
  private primaryColour: string = "#f1ae03";
  private secondaryColour: string = "#2c5268";
  private tertiaryColour: string = "#ec4040";
  private avatarColourToggle: boolean = false;
  private primaryColourToggle: boolean = false;
  private secondaryColourToggle: boolean = false;
  private tertiaryColourToggle: boolean = false;
  private basicColours: Array<String> = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  constructor(
    private databaseService: DatabaseService
  ) {
    this.buildSupportedSchools();
  }

  ngOnInit() {
    var fbCon: FBConnector = new FBConnector(this.fbKey);
    fbCon.initFB();
    if (this.user.Gender == 'male') {
      this.checkedGender.male = 'checked';
    } else {
      this.checkedGender.female = 'checked';
    }
  }

  buildSupportedSchools() {
    this.supportedSchools = ['-'];
    for (var i = 0; i < _.flatMap(SupportedSchoolsEnum).length / 2; i++) {
      this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
    }
  }

  updateUser() {
    this.closeAlert(true);
    let tempUser = this.user;
    let theme = this.primaryColour.concat(';', this.secondaryColour, ';', this.tertiaryColour);
    if (this.temporaryProfilePicture == '' || this.temporaryProfilePicture == this.user.PictureURL) {
      tempUser.PictureURL = this.user.PictureURL;
    } else {
      tempUser.PictureURL = this.temporaryProfilePicture;
    }

    tempUser.Theme = theme;
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

  closeAlert(force: boolean) {
    this.successOpacity = '0';
    if (force) {
      this.successDisplay = 'none';
    } else {
      setTimeout(() => {
        this.successDisplay = 'none';
      }, 600);
    }
  }

  randomizePicture() {
    this.pictureOpacity += '0';
    this.temporaryProfilePicture = this.avatarBaseUrl + Math.random();
  }

  customPicture(part: string) {
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

    let colour = this.avatarColour.substring(1);
    if (!this.temporaryProfilePicture.includes(colour)) {
      this.pictureOpacity += '0';
    }

    this.temporaryProfilePicture = this.avatarBaseUrl + 'face/'
      + this.avatarEyes[this.avatarEyesIndex] + '/'
      + this.avatarNose[this.avatarNoseIndex] + '/'
      + this.avatarMouth[this.avatarMouthIndex] + '/'
      + colour;
  }

  setFacebookPicture() {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        FB.api('/me', { fields: 'picture' }, (response) => this.setPicture(response));
      } else if (response.status === 'unknown') {
        FB.login((response) => {
          if (response.status === 'connected') {
            FB.api('/me', { fields: 'picture' }, (response) => this.setPicture(response));
          }
        });
      }
    });
  }

  setPicture(response) {
    if (this.temporaryProfilePicture != response.picture.data.url && this.temporaryProfilePicture != '') {
      this.pictureOpacity += '0';
      this.temporaryProfilePicture = response.picture.data.url;
    }
  }

}
