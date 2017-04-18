import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import { Subscription } from 'rxjs/Subscription';
import { NavService } from '../../../meta/nav.service';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  private currentTab: string;
  private slideOutWidth: string = '0px';
  private bodyLeftMargin: string = '0px';
  private bodyWidth: string = 'auto';
  private bodyHeight = '0px';
  private subscription: Subscription;
  private user: Observable<User>;
  private userID: string;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private databaseService: DatabaseService,
    private navService: NavService,
    private cookieService: CookieService,
    private elementRef: ElementRef
  ) {
    this.currentTab = navService.coursesTab;
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

  public ngOnInit() {
    this.user = this.databaseService.user;
    console.log('_______ in main _______');
    if (this.cookieService.get('userID')) {
      this.userID = this.cookieService.get('userID');
      this.databaseService.loadUser(this.userID);
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.currentTab = newTab;
    if (window.innerHeight <= 767) {
      this.closeNav();
    }
  }

  public updateSearch(text) {
    if (text === 'cats') {
      this.elementRef.nativeElement.querySelectorAll('div')[4].innerHTML = '<img src="https://placekitten.com/g/250/824">';
    }
  }

}
