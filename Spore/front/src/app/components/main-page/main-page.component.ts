import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { Http, Response } from '@angular/http';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import { TabsHelper } from '../../../meta/tabsHelper';
import { Subscription } from 'rxjs/Subscription';
import { NavService } from '../../../meta/nav.service';
import { CalendarComponent } from "angular2-fullcalendar/src/calendar/calendar";
import { ScheduleModule } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  private SelectedSchool: string = "Please select your school";
  private _color: string = '';
  private CurrentTab: string;
  private _slideWidth: string;
  private _slideLeft: string;
  private echoResponse: string = '...';
  private echoInput: string = 'echo';
  subscription: Subscription;
  user: Observable<User>;    
  userID: string;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private databaseService: DatabaseService,
    private tabsHelper: TabsHelper,
    private navService: NavService
  ) 
  { 
    this.CurrentTab = tabsHelper.DefaultTab;
    this.subscription = navService.navOpen$.subscribe(
      isOpen => {
        if(isOpen) {
          this.openNav();
        } else {
          this.closeNav();
        }
      }
    );
  }

  calendarOptions:Object = {
        fixedWeekCount : false,
        defaultDate: '2016-09-12',
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
          {
            title: 'All Day Event',
            start: '2016-09-01'
          },
          {
            title: 'Long Event',
            start: '2016-09-07',
            end: '2016-09-10'
          },
          {
            id: 999,
            title: 'Repeating Event',
            start: '2016-09-09T16:00:00'
          },
          {
            id: 999,
            title: 'Repeating Event',
            start: '2016-09-16T16:00:00'
          },
          {
            title: 'Conference',
            start: '2016-09-11',
            end: '2016-09-13'
          },
          {
            title: 'Meeting',
            start: '2016-09-12T10:30:00',
            end: '2016-09-12T12:30:00'
          },
          {
            title: 'Lunch',
            start: '2016-09-12T12:00:00'
          },
          {
            title: 'Meeting',
            start: '2016-09-12T14:30:00'
          },
          {
            title: 'Happy Hour',
            start: '2016-09-12T17:30:00'
          },
          {
            title: 'Dinner',
            start: '2016-09-12T20:00:00'
          },
          {
            title: 'Birthday Party',
            start: '2016-09-13T07:00:00'
          },
          {
            title: 'Click for Google',
            url: 'http://google.com/',
            start: '2016-09-28'
          }
        ]
      };

  ngOnInit() {
    this.user = this.databaseService.user;
    console.log('_______ in main _______');
    this.activatedRouter.params.forEach((params: Params) => {
      if(params['id'] !== undefined) {
        this.userID = params['id'];
        this.databaseService.loadUser(this.userID);
      }
    });
  }

  echoTester() {
    this.databaseService.echo(this.echoInput).then(data => this.echoResponse = data);
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

  selectUofT() {
    this.SelectedSchool = "University of Toronto";
    this._color = 'light-blue';
  }

  selectSheridan() {
    this.SelectedSchool = "Sheridan College";
    this._color = 'navy-blue';
  }

  selectNoSchool() {
    this.SelectedSchool = "Ain't got no time for that";
    this._color = 'green';
  }

  openNav() {
    this._slideWidth = '250px';
    this._slideLeft = '250px';
  }

  closeNav() {
    this._slideWidth = '0px';
    this._slideLeft = '0px';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
