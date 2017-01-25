import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../meta/event';
import { DatabaseService } from '../../../meta/database.service';
import * as moment from 'moment';
import * as jstz from 'jstz';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input()
  public userId: string;

  public event: Event;
  public events: any = [];
  public dialogVisible: boolean = false;
  public header: any = {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay'
  };
  public timezone = jstz.determine().name();
  // Currently not used (may be useful) - if not remove 'jstz' from package.json

  constructor(
    private databaseService: DatabaseService
  ) { }

  public ngOnInit() {
    this.databaseService.getUserEvents(this.userId, moment('2016-01-01', 'YYYY-MM-DD'),
      moment('2018-01-01', 'YYYY-MM-DD')).then(response => {
      if (response.error !== 0) {
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

  public handleEventClick(e) {
    this.event = new Event();
    if (e.calEvent.end) {
      this.event.endDate = new Date(e.calEvent.end.year(),
        e.calEvent.end.month(), e.calEvent.end.date());
    }

    this.event.startDate = new Date(e.calEvent.start.year(),
      e.calEvent.start.month(), e.calEvent.start.date());
    this.event.title = e.calEvent.title;
    this.event.id = e.calEvent.id;
    this.dialogVisible = true;
  }

  public handleDayClick(e) {
    this.event = new Event();
    this.event.startDate = new Date(e.date.year(), e.date.month(), e.date.date());
    this.dialogVisible = true;
  }

  public handleEventDrop(e) {
    let newEvent = new Event();
    newEvent.startDate = e.event.start;
    newEvent.endDate = e.event.end;
    newEvent.title = e.event.title;
    newEvent.id = e.event.id;
    this.databaseService.updateEvent(newEvent).then(response => {
      if (response.error !== 0) {
        e.revertFunc();
        window.alert('Error during updateEvent API call: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(newEvent.id), 1);
        this.events.push({id: newEvent.id, title: newEvent.title,
          start: newEvent.startDate.toISOString(), end: newEvent.endDate.toISOString()});
      }
    });
  }

  public saveEvent() {
    console.log(this.event);
    let start = this.event.startDate ? this.event.startDate.toISOString() : '';
    let end = this.event.endDate ? this.event.endDate.toISOString() : '';
    let title = this.event.title ? this.event.title : 'No Title';
    this.databaseService.addEvent(this.userId, this.event).then(response => {
      if (response.error !== 0) {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        this.events.push({id: response.data._id, title: title, start: start, end: end});
      }
    });

    this.closeEvent();
  }

  public updateEvent() {
    let start = this.event.startDate ? this.event.startDate.toISOString() : '';
    let end = this.event.endDate ? this.event.endDate.toISOString() : '';
    let title = this.event.title ? this.event.title : 'No Title';
    let id = this.event.id;
    this.databaseService.updateEvent(this.event).then(response => {
      if (response.error !== 0) {
        window.alert('Error during event update: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
        this.events.push({title: title, start: start, end: end, id: id});
      }
    });

    this.closeEvent();
  }

  public deleteEvent() {
    let id = this.event.id;
    this.databaseService.deleteUserEvent(this.userId, this.event.id).then(response =>  {
      if (response.status !== 200) {
        window.alert('Error during event delete: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
      }
    });

    this.closeEvent();
  }

  public closeEvent() {
    this.dialogVisible = false;
    this.event = undefined;
  }

  private EventIndexById(id: string): number {
    for (let i = 0; i < this.events.length; i += 1) {
        if (this.events[i]['id'] === id) {
            return i;
        }
    }

    return -1;
  }

}
