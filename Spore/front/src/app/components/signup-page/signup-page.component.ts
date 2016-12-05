/**
 * Created by anatale on 12/1/2016.
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {SupportedSchoolsEnum} from '../../../meta/SupportedSchools';

@Component({
  selector: 'signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignUpPageComponent implements OnInit{

  public supportedSchools;

  constructor(private router: Router){
    this.supportedSchools = _.flatMap(SupportedSchoolsEnum);
  }

  public ngOnInit() {
    this.supportedSchools = _.flatMap(SupportedSchoolsEnum);
    console.log(this.supportedSchools);
    console.log(SupportedSchoolsEnum);
  }

  sporeLogin(event: Event) {
    this.router.navigate(['/login']);
    console.log('Back to login');
  }
}
