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

  public sundayCheck = false;
  public mondayCheck = false;
  public tuesdayCheck = false;
  public wednesdayCheck = false;
  public thursdayCheck = false;
  public fridayCheck = false;
  public saturdayCheck = false;

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
          let dow = event.dow ? event.dow : [];
          let ranges = event.ranges ? event.ranges : [];
          if (dow.length > 0) {
            this.events.push({id: event._id, title: title, start: start, end: end, dow: dow, color: colour,  ranges: ranges});
          } else {
            this.events.push({id: event._id, title: title, start: start, end: end, color: colour,  ranges: ranges});
          }

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

  public ngAfterViewChecked() {
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
    this.event.colour = e.calEvent.color;
    if (e.calEvent.ranges) {
      let eventStartRange = moment(e.calEvent.ranges[0].start);
      let eventEndRange = moment(e.calEvent.ranges[0].end);
      this.event.ranges = [{start: new Date(eventStartRange.year(), eventStartRange.month(), eventStartRange.date(), eventStartRange.hours(), eventStartRange.minutes()),
        end: new Date(eventEndRange.year(), eventEndRange.month(), eventEndRange.date(), eventEndRange.hours(), eventEndRange.minutes())}];
    }
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
    let oldDow = moment(this.events.find(event => event.id === e.event.id).start).day();

    let newEvent = new Event();
    newEvent.startDate = e.event.start;
    newEvent.endDate = e.event.end;
    newEvent.title = e.event.title;
    newEvent.id = e.event.id;
    newEvent.colour = e.event.color;
    newEvent.ranges = e.event.ranges;
    if (e.event.dow) {
      newEvent.dow = [e.event.start.day()];
      for (let i = 0; i < e.event.dow.length; i ++) {
        if (e.event.dow[i] !== oldDow && e.event.dow !== e.event.start.day()) newEvent.dow.push(e.event.dow[i]);
      }
    }
    this.databaseService.updateEvent(newEvent).then(response => {
      if (response.error !== 0) {
        e.revertFunc();
        window.alert('Error during updateEvent API call: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(newEvent.id), 1);
        if (newEvent.ranges && (newEvent.ranges[0].start !== '' || newEvent.ranges[0].end !== '')) {
          this.events.push({id: newEvent.id, title: newEvent.title, start: newEvent.startDate.toISOString(), end: newEvent.endDate ? newEvent.endDate.toISOString() : '', color: newEvent.colour, dow: newEvent.dow, ranges: newEvent.ranges});
        } else {
          this.events.push({id: newEvent.id, title: newEvent.title, start: newEvent.startDate.toISOString(), end: newEvent.endDate ? newEvent.endDate.toISOString() : '', color: newEvent.colour});
        }
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
    let ranges = this.event.ranges ? this.event.ranges : [{start: '', end: ''}];
    let dow = [];
    if (ranges[0].start !== '' && ranges[0].end !== '') {
      if (this.sundayCheck) dow.push(0);
      if (this.mondayCheck) dow.push(1);
      if (this.tuesdayCheck) dow.push(2);
      if (this.wednesdayCheck) dow.push(3);
      if (this.thursdayCheck) dow.push(4);
      if (this.fridayCheck) dow.push(5);
      if (this.saturdayCheck) dow.push(6);
      this.event.dow = dow;
    }
    this.databaseService.addEvent(this.userId, this.event).then(response => {
      if (response.error !== 0) {
        window.alert('Error during addEvent API call: ' + response.data);
      } else {
        if (ranges[0].start !== '' && ranges[0].end !== '') {
          this.events.push({id: response.data._id, title: title, start: start, end: end, color: colour, dow: dow, ranges: ranges});
        } else {
          this.events.push({id: response.data._id, title: title, start: start, end: end, color: colour});
        }
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
    let ranges = this.event.ranges ? this.event.ranges: [{start: '', end: ''}];
    let id = this.event.id;
    let dow = [];
    if (ranges[0].start !== '' && ranges[0].end !== '') {
      if (this.sundayCheck) dow.push(0);
      if (this.mondayCheck) dow.push(1);
      if (this.tuesdayCheck) dow.push(2);
      if (this.wednesdayCheck) dow.push(3);
      if (this.thursdayCheck) dow.push(4);
      if (this.fridayCheck) dow.push(5);
      if (this.saturdayCheck) dow.push(6);
      this.event.dow = dow;
    }
    this.databaseService.updateEvent(this.event).then(response => {
      if (response.error !== 0) {
        window.alert('Error during event update: ' + response.data);
      } else {
        this.events.splice(this.EventIndexById(id), 1);
        if (ranges[0].start !== '' && ranges[0].end !== '') {
          this.events.push({id: response.data._id, title: title, start: start, end: end, color: colour, dow: dow, ranges: ranges});
        } else {
          this.events.push({id: response.data._id, title: title, start: start, end: end, color: colour});
        }
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
      restyleInput("startTime", "5");
      restyleInput("endTime", "4");
      restyleInput('startRangeTime', '3');
      restyleInput('endRangeTime', '2');
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

  public eventRender(event, element, view) {
    if (event.ranges && event.ranges.length > 0) {
      return event.ranges.filter((range) => {
        return event.start.isBefore(range.end) &&  (event.end ? event.end.isAfter(range.start) : event.start.isAfter(range.start));
      }).length > 0;
    }
  }

}
