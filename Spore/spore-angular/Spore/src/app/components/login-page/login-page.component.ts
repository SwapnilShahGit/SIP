import { Component, OnInit } from '@angular/core';
import { InfoCardComponent } from '../info-card/info-card.component';
import { FooterBarComponent } from '../footer-bar/footer-bar.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public username:string;
  public password:string;

  constructor() { }

  ngOnInit() {
  }

  public sporeLogin(event: Event) {
    /*this._router.navigate(['/main-page']);*/
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
