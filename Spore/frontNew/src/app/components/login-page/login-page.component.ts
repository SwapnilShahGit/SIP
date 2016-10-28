/**
 * Created by anatale on 10/28/2016.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
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
