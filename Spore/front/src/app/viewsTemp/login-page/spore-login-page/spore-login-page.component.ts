import { Component, OnInit } from '@angular/core';
import { SporeFooterBarComponent } from '../../spore-footer-bar/spore-footer-bar.component';
import { SporeInfoCardComponent } from '../spore-info-card/spore-info-card.component';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-spore-login-page',
  templateUrl: 'spore-login-page.component.html',
  styleUrls: ['spore-login-page.component.css'],
  directives: [SporeFooterBarComponent, SporeInfoCardComponent]
})
export class SporeLoginPageComponent implements OnInit {

  public username:string;
  public password:string;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  public sporeLogin(event: Event) {
    this._router.navigate(['/main-page']);
    console.log('Spore Login');
  }

  public sporeSignUp(event: Event) {
    console.log('Spore SignUp');
  }

  public rememberMe(event: Event) {
    console.log('Remember Me');
  }

  public forgotPassword(event: Event) {
    console.log('Forgot Password?');
  }

  public facebookLogin(event: Event) {
    console.log('Facebook Login');
  }

  public googleLogin(event: Event) {
    console.log('Google Login');
  }

  public linkedinLogin(event: Event) {
    console.log('LinkedIn Login');
  }

}
