/**
 * Created by anatale on 7/25/2016.
 */
import {Component} from 'angular2/core';
import {Schedule} from 'primeng/primeng';
import {InfoPanelView} from './info-panel/info-panel.view';

@Component({
    selector: 'sip-login-page',
    templateUrl: 'app/views/login-page/login-page.view.html',
    styleUrls: ['app/views/login-page/login-page.view.scss'],
    directives: [Schedule, InfoPanelView]
})
export class LoginPageView {
    /*public element = document.getElementById('login-section');
    element.addClass('form-success');*/
}