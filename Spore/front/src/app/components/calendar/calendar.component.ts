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
  events: any = [
    {
      title: 'dummy 1',
      start: '2016-09-07',
      end: '2016-09-08',
      id: 'some-value1'
    },
    {
      title: 'dummy 2',
      start: '2016-09-08',
      end: '2016-09-09',
      id: 'some-value2'
    },
    {
      title: 'dummy 3',
      start: '2016-09-08',
      end: '2016-09-09',
      id: 'some-value3'
    },
    {
      title: 'dummy 4',
      start: '2016-09-09',
      end: '2016-09-10',
      id: '5862fdac5adb91ec2f6d0c41'
    }
  ];  
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
    // THIS CALL NEEDS TO BE FIXED BEFORE USING IT, CURRENTLY ITLL ONLY WORK IF YOU GIVE IT EXACT DATES THE EVENT IS ON. CANT DO RANGES!
    this.databaseService.getUserEvents(this.userId, moment('2016-00-00'), moment('2017-00-00')).then(response => {
      if (response.error != '0') {
        console.log('Error during event population: ' + response.data);
      } else {
        console.log('Event population was successful (Currently call not doing proper responses): ' + response.data);
        // this.events = response.data;  
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
    this.event = new Event();
    this.event.Start = e.event.start;
    this.event.End = e.event.end;
    this.event.Title = e.event.title;
    this.event.Id = e.event.id;
    
    this.databaseService.updateEvent(this.event).then(response => {
      if (response.error != '0') {
        e.revertFunc();
      } else {
        console.log('event updated');
      }
    });

    this.event = undefined;
  }

  saveEvent() {  
    // add update call here somewhere
    this.event.End = this.event.EndDate ? moment(this.DateToIsoString(this.event.EndDate)) : undefined;
    let start = this.event.StartDate ? this.event.Start.toISOString().substring(0, 10) : '';
    let end = this.event.EndDate ? this.event.End.toISOString().substring(0, 10) : '';
    let title = this.event.Title ? this.event.Title : 'No Title';
    this.databaseService.addEvent(this.userId, this.event).then(response => {
      if (response.error != '0') {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        // Once call is updated, id value should be returned from addEvent call and pushed to the event.
        this.events.push({title: title, start: start, end: end});
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
        console.log('event updated');
        this.events.splice(this.EventIndexById(id), 1);
        this.events.push({title: title, start: start, end: end, id: id})
      }
    });

    this.dialogVisible = false;
    this.event = undefined;
  }

  deleteEvent() {
    /// This call needs to be fixed. Currently dont have id - addEvent call needs to have id returned when created
    /// Also currently deleteUserEvent does nothing it seems. Check up on that. (deleteEvent works fine)
    let id = this.event.Id;
    this.databaseService.deleteUserEvent(this.userId, this.event.Id).then(response =>  {
      if (response.error != '0') {
        window.alert('Error during event delete: ' + response.data);
      } else {
        console.log('Successful delete response: ' + response.data);
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