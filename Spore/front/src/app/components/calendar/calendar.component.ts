import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../meta/event';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import * as moment from 'moment';
import { Moment } from 'moment';

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

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.databaseService.getUserEvents("586ee9a669db6c7c59cc6fa7", moment('2016-01-01', 'YYYY-MM-DD'), moment('2018-01-01', 'YYYY-MM-DD')).then(response => {
      if (response.error != '0') {
        console.log('Error during event population: ' + response.data);
      } else {
        for (let event of response.data) {
          let title = event.title ? event.title : '';
          let start = event.start ? event.start.substring(0, 10) : '';
          let end = event.end ? event.end.substring(0, 10) : '';
          this.events.push({id: event.id, title: title, start: start, end: end});
        }
      }
    });
  }

  handleEventClick(e) {
    this.event = new Event();
    if(e.calEvent._end) {
      this.event.End = e.calEvent.end;
      this.event.EndDate = this.event.End.toDate();
      this.event.EndDate.setDate(this.event.EndDate.getDate() + 1);
    }

    this.event.Start = e.calEvent.start;
    this.event.StartDate = this.event.Start.toDate();
    this.event.StartDate.setDate(this.event.StartDate.getDate() + 1);
    this.event.Title = e.calEvent.title;
    this.event.Id = e.calEvent.id;
    this.dialogVisible = true;
  }

  handleDayClick(e) {
    this.event = new Event();
    this.event.Start = e.date;
    this.event.StartDate = this.event.Start.toDate();
    this.event.StartDate.setDate(this.event.StartDate.getDate() + 1);
    this.dialogVisible = true;
  }

  handleEventDrop(e) {
    let newEvent = new Event();
    newEvent.Start = e.event.start;
    newEvent.End = e.event.end;
    newEvent.Title = e.event.title;
    newEvent.Id = e.event.id;
    this.databaseService.updateEvent(newEvent).then(response => {
      if (response.error != '0') {
        e.revertFunc();
        window.alert('Error during updateEvent API call: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(newEvent.Id), 1);
        this.events.push({id: newEvent.Id, title: newEvent.Title, start: newEvent.Start.toISOString().substring(0, 10), end: newEvent.End.toISOString().substring(0, 10)});
      }
    });
  }

  saveEvent() {
    this.event.End = this.event.EndDate ? moment(this.DateToIsoString(this.event.EndDate)) : undefined;
    let start = this.event.StartDate ? this.event.Start.toISOString().substring(0, 10) : '';
    let end = this.event.EndDate ? this.event.End.toISOString().substring(0, 10) : '';
    let title = this.event.Title ? this.event.Title : 'No Title';
    this.databaseService.addEvent("586ee9a669db6c7c59cc6fa7", this.event).then(response => {
      if (response.error != '0') {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        this.events.push({id: response.data._id, title: title, start: start, end: end});
      }
    });

    this.dialogVisible = false;
    this.event = undefined;
  }

  updateEvent() {
    this.event.Start = this.event.StartDate ? moment(this.DateToIsoString(this.event.StartDate)) : undefined;
    this.event.End = this.event.EndDate ? moment(this.DateToIsoString(this.event.EndDate)) : undefined;
    let start = this.event.StartDate ? this.event.Start.toISOString().substring(0, 10) : '';
    let end = this.event.EndDate ? this.event.End.toISOString().substring(0, 10) : '';
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

    this.dialogVisible = false;
    this.event = undefined;
  }

  deleteEvent() {
    console.log(this.event);
    let id = this.event.Id;
    this.databaseService.deleteUserEvent("586ee9a669db6c7c59cc6fa7", this.event.Id).then(response =>  {
      if (response.error != '0') {
        window.alert('Error during event delete: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
      }
    });

    this.dialogVisible = false;
    this.event = undefined;
  }

  private DateToIsoString(event: Date): string {
    let month = event.getMonth() < 10 ? '0' + (event.getMonth() + 1) : (event.getMonth() + 1);
    let date = event.getDate() < 10 ? '0' + event.getDate() : event.getDate();
    return event.getFullYear() + '-' + month + '-' + date;
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
