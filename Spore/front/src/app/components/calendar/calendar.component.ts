import { Component, OnInit } from '@angular/core';
import { Event } from '../../../meta/event';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

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
    }
  ];

  constructor() { }

  ngOnInit() {
    /// Add a call to populate the calendar content here (or observe it)
  }

  handleEventClick(e) {
    this.event = new Event();
    this.event.Start = e.calEvent._start.toDate();
    this.event.Start.setDate(this.event.Start.getDate() + 1); // have to add 1 day for some reason...
    this.dialogVisible = true;
    console.log("event clicked - " + e.calEvent.title);
  }

  handleDayClick(e) {
    this.event = new Event();
    this.event.Start = e.date.toDate();
    this.event.Start.setDate(this.event.Start.getDate() + 1); // have to add 1 day for some reason...
    this.dialogVisible = true;
    console.log("day clicked - " + this.event.Start);
  }

  saveEvent() {
    if (this.event.Id) {
      // update call
      console.log("update called");
    } else {
      // create call
      console.log("create called");
    }

    this.dialogVisible = false;
    this.event = undefined;
  }

  deleteEvent() {
    // delete call
    this.dialogVisible = false;
    this.event = undefined;
    console.log("delete called");
  }

}