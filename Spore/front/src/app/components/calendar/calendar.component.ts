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
      id: 'some-value4'
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
    this.databaseService.getUserEvents(this.userId, '2016-00-00', '2017-00-00').then(response => {
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
      this.event.End = e.calEvent._end.toDate();
    }

    this.event.Start = e.calEvent._start.toDate();
    this.event.Start.setDate(this.event.Start.getDate() + 1);
    this.event.Title = e.calEvent.title;
    this.event.Id = e.calEvent.id;
    this.dialogVisible = true;
  }

  handleDayClick(e) {
    this.event = new Event();
    this.event.Start = e.date.toDate();
    this.event.Start.setDate(this.event.Start.getDate() + 1);
    this.dialogVisible = true;
  }

  saveEvent() {  
    // add update call here somewhere
    let start = this.event.Start ? this.ToIsoStringDate(this.event.Start) : '';
    let end = this.event.End ? this.ToIsoStringDate(this.event.End) : '';
    let title = this.event.Title ? this.event.Title : 'No Title';
    this.databaseService.addEvent(this.userId, start, end, title).then(response => {
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

  private ToIsoStringDate(event: Date): string {
    let month = event.getMonth() < 10 ? '0' + (event.getMonth() + 1) : (event.getMonth() + 1);
    let date = event.getDate() < 10 ? '0' + event.getDate() : event.getDate();
    console.log(event.getFullYear() + '-' + month + '-' + date);
    return event.getFullYear() + '-' + month + '-' + date;
  }

  private ToIsoStringDateAndTime(event: Date): string {
    return this.ToIsoStringDate(event) + 'T' + event.getUTCHours();
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