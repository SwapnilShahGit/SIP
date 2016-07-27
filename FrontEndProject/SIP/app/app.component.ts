import {Component} from 'angular2/core';
import {Schedule} from 'primeng/primeng';
import {CalendarComponent} from './components/calendar/calendar.component';
import {StaticBarComponent} from './components/static-bar/static-bar.component';

@Component({
	selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.scss'],
    directives: [Schedule, CalendarComponent, StaticBarComponent]
})
export class AppComponent {

    text: string;
}