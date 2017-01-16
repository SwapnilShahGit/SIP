import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../meta/event';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as jstz from 'jstz';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() userId: string;

  event: Event;
  events: any = [];
  dialogVisible: boolean = false;
  header: any = {
	  left: 'prev,next today',
	  center: 'title',
	  right: 'month,agendaWeek,agendaDay'
	};
  timezone = jstz.determine().name(); // Currently not used (may be useful) - if not remove 'jstz' from package.json

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.databaseService.getUserEvents(this.userId, moment('2016-01-01', 'YYYY-MM-DD'), moment('2018-01-01', 'YYYY-MM-DD')).then(response => {
      if (response.error != '0') {
        console.log('Error during event population: ' + response.data);
      } else {
        for (let event of response.data) {
          let title = event.title ? event.title : '';
          let start = event.start ? event.start : '';
          let end = event.end ? event.end : '';
          this.events.push({id: event._id, title: title, start: start, end: end});
        }
      }
    });
  }

  handleEventClick(e) {
    this.event = new Event();
    if(e.calEvent.end) {
      this.event.EndDate = new Date(e.calEvent.end.year(), e.calEvent.end.month(), e.calEvent.end.date());
    }

    this.event.StartDate = new Date(e.calEvent.start.year(), e.calEvent.start.month(), e.calEvent.start.date());
    this.event.Title = e.calEvent.title;
    this.event.Id = e.calEvent.id;
    this.dialogVisible = true;
  }

  handleDayClick(e) {
    this.event = new Event();
    this.event.StartDate = new Date(e.date.year(), e.date.month(), e.date.date());
    this.dialogVisible = true;
  }

  handleEventDrop(e) {
    let newEvent = new Event();
    newEvent.StartDate = e.event.start;
    newEvent.EndDate = e.event.end;
    newEvent.Title = e.event.title;
    newEvent.Id = e.event.id;
    this.databaseService.updateEvent(newEvent).then(response => {
      if (response.error != '0') {
        e.revertFunc();
        window.alert('Error during updateEvent API call: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(newEvent.Id), 1);
        this.events.push({id: newEvent.Id, title: newEvent.Title, start: newEvent.StartDate.toISOString(), end: newEvent.EndDate.toISOString()});
      }
    });
  }

  saveEvent() {
    let start = this.event.StartDate ? this.event.StartDate.toISOString() : '';
    let end = this.event.EndDate ? this.event.EndDate.toISOString() : '';
    let title = this.event.Title ? this.event.Title : 'No Title';
    this.databaseService.addEvent(this.userId, this.event).then(response => {
      if (response.error != '0') {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        this.events.push({id: response.data._id, title: title, start: start, end: end});
      }
    });

    this.closeEvent();
  }

  updateEvent() {
    let start = this.event.StartDate ? this.event.StartDate.toISOString() : '';
    let end = this.event.EndDate ? this.event.EndDate.toISOString() : '';
    let title = this.event.Title ? this.event.Title : 'No Title';
    let id = this.event.Id;
    this.databaseService.updateEvent(this.event).then(response => {
      if (response.error != '0') {
        window.alert('Error during event update: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
        this.events.push({title: title, start: start, end: end, id: id})
      }
    });

    this.closeEvent();
  }

  deleteEvent() {
    let id = this.event.Id;
    this.databaseService.deleteUserEvent(this.userId, this.event.Id).then(response =>  {
      if (response.status != '200') {
        window.alert('Error during event delete: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
      }
    });

    this.closeEvent();
  }

  closeEvent() {
    this.dialogVisible = false;
    this.event = undefined;
  }

  private EventIndexById(id: string): number {
    for(var i = 0; i < this.events.length; i += 1) {
        if(this.events[i]['id'] === id) {
            return i;
        }
    }

    return -1;
  }

}
