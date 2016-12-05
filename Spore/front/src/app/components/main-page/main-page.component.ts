import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { Http, Response } from '@angular/http';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import { Subscription } from 'rxjs/Subscription';
import { NavService } from '../../../meta/nav.service';
import { CalendarComponent } from "angular2-fullcalendar/src/calendar/calendar";
import { ScheduleModule } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';
import {TabsHelper} from "../../../meta/tabsHelper";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  private _color: string = '';
  private CurrentTab: string;
  private slideOutWidth: string = '0px';
  private bodyLeftMargin: string = '0px';
  private bodyWidth: string = 'auto';
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
  ) {
    this.CurrentTab = tabsHelper.HelpTab;
    this.subscription = navService.navOpen$.subscribe(
      isOpen => {
        if (isOpen) {
          this.openNav();
        } else {
          this.closeNav();
        }
      }
    );
  }

  calendarOptions: Object = {
    fixedWeekCount: false,
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
        start: '2016-09-16T18:00:00'
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
      if (params['id'] !== undefined) {
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

  openNav() {
    if (window.innerWidth <= 767) {
      this.slideOutWidth = window.innerWidth.toString() + 'px';
      this.bodyLeftMargin = '0px';
      this.bodyWidth = '0px';
    } else {
      this.slideOutWidth = '250px';
      this.bodyLeftMargin = '250px';
      this.bodyWidth = 'auto';
    }
  }

  closeNav() {
    this.slideOutWidth = '0px';
    this.bodyLeftMargin = '0px';
    this.bodyWidth = 'auto';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
