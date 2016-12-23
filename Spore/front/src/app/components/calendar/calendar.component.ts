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
      title: 'xyz',
      start: '2016-09-07',
      end: '2016-09-08'
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
      console.log(response);
      if(response.error != '0') {
        console.log('ERROR LOADING EVENTS');
      } else {
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
    this.dialogVisible = true;
  }

  handleDayClick(e) {
    this.event = new Event();
    this.event.Start = e.date.toDate();
    this.event.Start.setDate(this.event.Start.getDate() + 1);
    this.dialogVisible = true;
  }

  saveEvent() {  
    //todo: add update call here somewhere
    let start = this.event.Start ? this.ToIsoStringDate(this.event.Start) : '';
    let end = this.event.End ? this.ToIsoStringDate(this.event.End) : '';
    let title = this.event.Title ? this.event.Title : 'No Title';
    this.databaseService.addEvent(this.userId, start, end, title).then(response => {
      if(response.error != '0') {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        this.events.push({title: title, start: start, end: end});
      }
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
    let month = event.getMonth() < 10 ? '0' + (event.getMonth() + 1) : (event.getMonth() + 1);
    let date = event.getDate() < 10 ? '0' + event.getDate() : event.getDate();
    console.log(event.getFullYear() + '-' + month + '-' + date);
    return event.getFullYear() + '-' + month + '-' + date;
  }

  private ToIsoStringDateAndTime(event: Date): string {
    return this.ToIsoStringDate(event) + 'T' + event.getUTCHours();
  }

}