/**
 * Created by anatale on 7/8/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {Schedule} from 'primeng/primeng';

@Component({
    selector: 'sip-calendar',
    templateUrl: 'app/components/calendar/calendar.component.html',
    styleUrls: ['app/components/calendar/calendar.component.css'],
    directives: [Schedule]
})
export class CalendarComponent implements OnInit {

    text: string;
    events: any[];

    ngOnInit() {
        this.events = [
            {
                "title": "All Day Event",
                "start": "2016-01-01"
            },
            {
                "title": "Long Event",
                "start": "2016-01-07",
                "end": "2016-01-10"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2016-01-11",
                "end": "2016-01-13"
            }
        ];
    }
}