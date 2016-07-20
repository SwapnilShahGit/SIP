/**
 * Created by anatale on 7/8/2016.
 */
import {Component} from 'angular2/core';
import {Schedule} from 'primeng/primeng';

@Component({
    selector: 'sip-calendar',
    templateUrl: 'app/components/calendar/calendar.component.html',
    styleUrls: ['app/components/calendar/calendar.component.css'],
    directives: [Schedule]
})
export class CalendarComponent {

    text: string;
}