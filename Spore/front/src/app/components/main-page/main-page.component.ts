import { Component, OnInit, AfterContentChecked, OnDestroy, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import { Subscription } from 'rxjs/Subscription';
import { NavService } from '../../../meta/nav.service';
import { TabService } from '../../../meta/tab.service';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import * as moment from 'moment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterContentChecked, OnDestroy {

  private currentTab: String = 'CalendarTab';
  private slideOutWidth: string = '0px';
  private bodyLeftMargin: string = '0px';
  private bodyWidth: string = 'auto';
  private bodyHeight = '0px';
  private subscription: Subscription;
  private user: Observable<User>;
  private userID: string;
  private tabSubscription: Subscription;
  private userEvents = [];

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private databaseService: DatabaseService,
    private navService: NavService,
    private cookieService: CookieService,
    private elementRef: ElementRef,
    private tabService: TabService
  ) {
    this.currentTab = tabService.calendarTab;
    this.subscription = navService.navOpen$.subscribe(
      isOpen => {
        if (isOpen) {
          this.openNav();
        } else {
          this.closeNav();
        }
      }
    );
    this.tabSubscription = tabService.tabSelectedSource.subscribe(
      selectedTab => {
        this.currentTab = selectedTab;
      }
    )
  }

  public ngOnInit() {
    this.user = this.databaseService.user;
    if (this.cookieService.get('userID')) {
      this.userID = this.cookieService.get('userID');
      this.databaseService.loadUser(this.userID);

      this.databaseService.getUserEvents(this.userID, moment('2016-01-01', 'YYYY-MM-DD'),
        moment('2018-01-01', 'YYYY-MM-DD')).then(response => {
        if (response.error !== 0) {
          console.log('Error during event population: ' + response.data);
        } else {
          this.userEvents = response.data;
        }
      });
    }
    if (this.cookieService.get('userTab')) {
      this.tabService.switchTabs(this.cookieService.get('userTab'));
    } else {
      this.cookieService.put('userTab', this.tabService.calendarTab);
    }
  }

  public ngAfterContentChecked() {
    this.switchTabs(this.currentTab);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.tabSubscription.unsubscribe();
  }

  public navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

  public openNav() {
    if (window.innerWidth <= 767) {
      this.slideOutWidth = window.innerWidth.toString() + 'px';
      this.bodyLeftMargin = '0px';
      this.bodyWidth = '0px';
    } else {
      this.slideOutWidth = '250px';
      this.bodyLeftMargin = '250px';
      this.bodyWidth = 'auto';
    }

    this.bodyHeight = (window.innerHeight - 125).toString() + 'px';

  }

  public closeNav() {
    this.slideOutWidth = '0px';
    this.bodyLeftMargin = '0px';
    this.bodyWidth = 'auto';
    this.bodyHeight = '0px';
  }

  public switchTabs(newTab) {
    this.tabService.switchTabs(newTab);
    if (window.innerHeight <= 767) {
      this.closeNav();
    }
  }

  public updateSearch(text) {
    if (text === 'cats') {
      this.elementRef.nativeElement.querySelectorAll('div')[4].innerHTML = '<img src="https://placekitten.com/g/250/824">';
      for (var i = 0; i < this.elementRef.nativeElement.querySelectorAll('td').length; i++) {
        if (this.elementRef.nativeElement.querySelectorAll('td')[i].className.includes('fc-day ui-widget-content')) {
          this.elementRef.nativeElement.querySelectorAll('td')[i].innerHTML = '<img src="https://placekitten.com/g/230/230">';
        }
      }
    }
  }

}
