import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../meta/user';
import { SupportedSchoolsEnum } from '../../../meta/SupportedSchools';
import * as _ from 'lodash';
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    @Input()
    public user: User;

    private supportedSchools: any[];
    private checkedGender = { male: '', female: '' };
    private successDisplay: string = 'none';
    private successOpacity: string = '1';

    constructor(private databaseService: DatabaseService) {
      this.buildSupportedSchools();
    }

    ngOnInit() {
      if (this.user.Gender === 'male') {
        this.checkedGender.male = 'checked';
      } else {
        this.checkedGender.female = 'checked';
      }
    }

    public buildSupportedSchools() {
      this.supportedSchools = ['-'];
      for (let i = 0; i < _.flatMap(SupportedSchoolsEnum).length / 2 ; i ++) {
        this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
      }
    }

    public updateUser() {
      this.closeAlert(true);
      this.databaseService.updateUser(this.user).then(response => {
        console.log(response);
        if (response.error !== 0) {
          window.alert('Error occured during update API call: ' + response.data);
        } else {
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
 }
