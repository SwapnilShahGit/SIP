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

  public supportedSchools = [];

  constructor(private router: Router){
    this.supportedSchools.push('Select a School');
    for(var i = 0; i < _.flatMap(SupportedSchoolsEnum).length /2 ; i ++) {
      this.supportedSchools.push(_.flatMap(SupportedSchoolsEnum)[i]);
    }
  }

  public ngOnInit() {
  }

  sporeLogin(event: Event) {
    this.router.navigate(['/login']);
    console.log('Back to login');
  }
}
