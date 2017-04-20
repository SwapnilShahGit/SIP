import { Component, OnInit, Input, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Event } from '../../../meta/event';
import { DatabaseService } from '../../../meta/database.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input()
  public userId: string;

  public event: Event;
  public events: any = [];
  public dialogUpdate: boolean = false;
  public dialogCreate: boolean = false;
  public userSub: Subscription;
  public invalid: any = null;
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
          let colour = event.colour ? event.colour : '#E7EAEE';
          this.events.push({id: event._id, title: title, start: start, end: end, colour: colour});
        }
        /*this.events.push({id: '111', title: 'test', start: '10:00', end: '14:00', dow: [1,4], color: '#000000', ranges: [{
          start: moment().startOf('week'), //next two weeks
          end: moment().endOf('week').add(7,'d'),
        }] });*/
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

  public ngAfterViewChecked() {
    this.renderColours();
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
    if (!this.validateEvent(e.event)) {
      return;
    }

    let newEvent = new Event();
    newEvent.startDate = e.event.start;
    newEvent.endDate = e.event.end;
    newEvent.title = e.event.title;
    newEvent.id = e.event.id;
    newEvent.colour = e.event.colour;
    this.databaseService.updateEvent(newEvent).then(response => {
      if (response.error !== 0) {
        e.revertFunc();
        window.alert('Error during updateEvent API call: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(newEvent.id), 1);
        this.events.push({id: newEvent.id, title: newEvent.title,
          start: newEvent.startDate.toISOString(), end: newEvent.endDate.toISOString(), colour: newEvent.colour});
        this.renderColours();
      }
    });
  }

  public saveEvent() {
    if (!this.validateEvent(this.event)) {
      return;
    }

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
    if (!this.validateEvent(this.event)) {
      return;
    }

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

  private toggleModal(): void {
    this.invalid = null;
    document.getElementById("hiddenModalOpener").click();
    let restyleInput = this.restyleInput;
    setTimeout(function() {
      restyleInput("startTime", "3");
      restyleInput("endTime", "2");
    }, 1);
  }

  private restyleInput(className: String, zIndex: String): void {
    let startTimeOuter = document.getElementsByClassName(className + "Outer");
      if (startTimeOuter.length > 0) {
        let startTimeInput = startTimeOuter[0] as HTMLElement;
        startTimeInput.style.padding = "0px";
        startTimeInput.style.border = "none";
        startTimeInput.style.borderRadius = "4px";
        startTimeInput.style.zIndex = zIndex.toString();
      }

      let startTimeInner = document.getElementsByClassName(className + "Inner");
      if (startTimeInner.length > 0) {
        let startTimeInput = startTimeInner[0] as HTMLElement;
        startTimeInput.style.borderRadius = "4px";
      }
  }

  private validateEvent(event): boolean {
    this.invalid = null;
    if (!event.title || !(event.start || event.startDate)) {
      this.handleInvalidEvent(event);
      return false;
    }

    return true;
  }

  private handleInvalidEvent(event: Event): void {
    this.invalid = {};
    if (!event.startDate) {
      this.invalid.startDate = true;
    }

    if (!event.title) {
      this.invalid.title = true;
    }
  }

  private renderColours() {
    if (this.elementRef.nativeElement.querySelectorAll('a').length > 0) {
      for (let i = 0; i < this.elementRef.nativeElement.querySelectorAll('a').length; i ++) {
        if (this.elementRef.nativeElement.querySelectorAll('a')[i].className.includes('fc-day-grid-event') && this.elementRef.nativeElement.querySelectorAll('a')[i].children[0].children) {
          for (let j = 0; j < this.elementRef.nativeElement.querySelectorAll('a')[i].children[0].children.length; j ++) {
            if (this.elementRef.nativeElement.querySelectorAll('a')[i].children[0].children[j].className === 'fc-title') {
              let currentEvent = this.events.find(val => val.title === this.elementRef.nativeElement.querySelectorAll('a')[i].children[0].children[j].innerHTML);
              this.elementRef.nativeElement.querySelectorAll('a')[i].style.backgroundColor = currentEvent.colour;
              this.elementRef.nativeElement.querySelectorAll('a')[i].style.borderColor = currentEvent.colour;
            }
          }
        }
      }
    }
  }

  public eventRender(event, element, view) {
    if (event.ranges) {
      return event.ranges.filter((range) => {
        return event.start.isBefore(range.end) && event.end.isAfter(range.start);
      }).length > 0;
    }
  }

}
