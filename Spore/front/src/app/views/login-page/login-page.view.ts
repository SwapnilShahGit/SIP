/**
 * Created by anatale on 7/25/2016.
 */
import {Component} from '@angular/core';
/*import {Schedule} from 'primeng/primeng';*/
import {InfoPanelView} from './info-panel/info-panel.view';
import {FooterBarView} from '../footer-bar/footer-bar.view';

@Component({
    selector: 'sip-login-page',
    templateUrl: '/app/views/login-page/login-page.view.html',
    styleUrls: ['/app/views/login-page/login-page.view.scss'],
    directives: [InfoPanelView, FooterBarView]
})
export class LoginPageView {
    public username:string;
  public password:string;

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
