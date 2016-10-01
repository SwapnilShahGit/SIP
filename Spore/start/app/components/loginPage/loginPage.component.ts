import { Component, OnInit } from 'angular2/core';
import { SporeInfoCardComponent } from '../spore-info-card/spore-info-card.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'login-page',
    templateUrl: './app/components/loginPage/loginPage.component.html',
    styleUrls: ['./app/components/loginPage/loginPage.component.css'],
    directives: [SporeInfoCardComponent, FooterComponent]
})
export class LoginPageComponent implements OnInit {
  public username:string;
  public password:string;

  ngOnInit() {
  }

  public sporeLogin(event: Event) {
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