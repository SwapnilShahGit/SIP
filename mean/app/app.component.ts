import {Component} from 'angular2/core';
import {Schedule} from 'primeng/primeng';
import {CalendarComponent} from './components/calendar/calendar.component';
import {StaticBarComponent} from './components/static-bar/static-bar.component';
import {LoginPageView} from './views/login-page/login-page.view';
import {MainPageView} from './views/main-page/main-page.view';

@Component({
	selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.scss'],
    directives: [Schedule, CalendarComponent, StaticBarComponent, LoginPageView, MainPageView]
})
export class AppComponent {

    text: string;
}