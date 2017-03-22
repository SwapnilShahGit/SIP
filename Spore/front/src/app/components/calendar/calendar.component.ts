import { Component, OnInit, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Event } from '../../../meta/event';
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public userId: string;

  public event: Event;
  public events: any = [];
  public dialogUpdate: boolean = false;
  public dialogCreate: boolean = false;
  public userSub: Subscription;
  public header: any = {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay'
  };

  constructor(
    private databaseService: DatabaseService,
    private elementRef: ElementRef
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
          let colour = event.bg ? event.bg : '#E7EAEE'; //todo double check that .bg is correct here
          this.events.push({id: event._id, title: title, start: start, end: end, colour: colour});
        }
      }
    });
  }

  public ngAfterViewInit() {
    this.userSub = this.databaseService.user.subscribe((user) => {
      for (let button = 0; button < 6; button ++) { // 6 because there are 6 buttons we want to adjust at the top of p-schedule
        this.elementRef.nativeElement.querySelectorAll('button')[button].style.backgroundColor = user.theme.tertiaryColour;
        this.elementRef.nativeElement.querySelectorAll('button')[button].style.borderColor = user.theme.tertiaryColour;
        this.elementRef.nativeElement.querySelectorAll('button')[button].style.textTransform = 'capitalize';
        this.elementRef.nativeElement.querySelectorAll('button')[button].style.borderRadius = '3px';
        this.elementRef.nativeElement.querySelectorAll('button')[button].style.marginTop = '40px';
        if (button === 0 || button === 3 || button === 4) {
          this.elementRef.nativeElement.querySelectorAll('button')[button].style.marginRight = '0.75em';
        }
      }
    });
  }

  public ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  public handleEventClick(e) {
    this.event = new Event();
    if (e.calEvent.end) {
      this.event.endDate = new Date(e.calEvent.end.year(), e.calEvent.end.month(),
        e.calEvent.end.date(), e.calEvent.end.hours(), e.calEvent.end.minutes());
    }

    this.event.startDate = new Date(e.calEvent.start.year(), e.calEvent.start.month(),
      e.calEvent.start.date(), e.calEvent.start.hours(), e.calEvent.start.minutes());
    this.event.title = e.calEvent.title;
    this.event.id = e.calEvent.id;
    this.event.colour = e.calEvent.colour;
    this.dialogUpdate = true;
    this.toggleModal();
  }

  public handleDayClick(e) {
    this.event = new Event();
    this.event.startDate = new Date(e.date.year(), e.date.month(), e.date.date());
    this.dialogUpdate = true;
    this.toggleModal();
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
    let start = this.event.startDate ? this.event.startDate.toISOString() : '';
    let end = this.event.endDate ? this.event.endDate.toISOString() : '';
    let title = this.event.title ? this.event.title : 'No Title';
    let colour = this.event.colour ? this.event.colour : '#E7EAEE';
    this.databaseService.addEvent(this.userId, this.event).then(response => {
      if (response.error !== 0) {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        this.events.push({id: response.data._id, title: title, start: start, end: end, colour: colour});
      }
    });

    this.closeEvent();
  }

  public updateEvent() {
    let start = this.event.startDate ? this.event.startDate.toISOString() : '';
    let end = this.event.endDate ? this.event.endDate.toISOString() : '';
    let title = this.event.title ? this.event.title : 'No Title';
    let colour = this.event.colour ? this.event.colour : '#E7EAEE';
    let id = this.event.id;
    this.databaseService.updateEvent(this.event).then(response => {
      if (response.error !== 0) {
        window.alert('Error during event update: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
        this.events.push({id: id, title: title, start: start, end: end, colour: colour});
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
    this.toggleModal();
    setTimeout(function() {
      this.dialogUpdate = false;
      this.event = undefined;
    }, 100);
  }

  private EventIndexById(id: string): number {
    for (let i = 0; i < this.events.length; i += 1) {
        if (this.events[i]['id'] === id) {
            return i;
        }
    }

    return -1;
  }

  private toggleModal() {
    document.getElementById("hiddenModalOpener").click();
  }

}
