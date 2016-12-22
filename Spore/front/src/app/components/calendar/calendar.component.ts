import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../meta/event';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() userId: string;

  event: Event;
  dialogVisible: boolean = false;
  header: any = {
	  left: 'prev,next today',
	  center: 'title',
	  right: 'month,agendaWeek,agendaDay'
	};

  events: any = [
    {
      title: 'All Day Event',
      start: '2016-09-01'
    },
    {
      title: 'Long Event',
      start: '2016-09-07',
      end: '2016-09-10'
    },
    {
      title: 'Event 1pm-3pm',
      start: '2016-09-20T13:00:00',
      end: '2016-09-20T15:00:00'
    }
  ];

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    /// Add a call to populate the calendar content here (or observe it)
  }

  handleEventClick(e) {
    this.event = new Event();

    if(e.calEvent._end) {
      this.event.End = e.calEvent._end.toDate();
    }

    this.event.Start = e.calEvent._start.toDate();
    this.dialogVisible = true;
    console.log("event clicked - " + e.calEvent.title);
  }

  handleDayClick(e) {
    this.event = new Event();
    this.event.Start = e.date.toDate();
    this.event.Start.setDate(this.event.Start.getDate() + 1);
    this.dialogVisible = true;
    console.log("day clicked - " + this.event.Start);
  }

  saveEvent() {  
    //todo: add update call here somewhere - use if statement to split the 2 cases
    this.databaseService.addEvent(this.userId, 
      this.event.Start ? this.ToIsoStringDate(this.event.Start) : '', 
      this.event.End ? this.ToIsoStringDate(this.event.End) : '',
      this.event.Title ? this.event.Title : 'No Title Given'  // bind title to title TODO
    ).then(errorCode => {
      // if() error code ... TODO 
      // else no error code ... TODO
    });

    this.dialogVisible = false;
    this.event = undefined;
  }

  deleteEvent() {
    // delete call
    this.dialogVisible = false;
    this.event = undefined;
    console.log("delete called");
  }

  private ToIsoStringDate(event: Date): string {
    return event.getFullYear() + '-' + event.getMonth() + '-' + event.getDate();
  }

  private ToIsoStringDateAndTime(event: Date): string {
    return this.ToIsoStringDate(event) + 'T' + event.getUTCHours();
  }

}