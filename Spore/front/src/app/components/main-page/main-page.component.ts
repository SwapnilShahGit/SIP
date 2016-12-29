import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Http, Response } from '@angular/http';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/user';
import { Subscription } from 'rxjs/Subscription';
import { NavService } from '../../../meta/nav.service';
import { Observable } from 'rxjs/Rx';

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
  private bodyHeight = '0px';
  subscription: Subscription;
  user: Observable<User>;
  userID: string;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private databaseService: DatabaseService,
    private navService: NavService
  ) {
    this.CurrentTab = navService.CalendarTab;
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

    this.bodyHeight = (window.innerHeight - 125).toString() + 'px';

  }

  closeNav() {
    this.slideOutWidth = '0px';
    this.bodyLeftMargin = '0px';
    this.bodyWidth = 'auto';
    this.bodyHeight = '0px';
  }

  switchTabs(newTab) {
    this.CurrentTab = newTab;
    if (window.innerHeight <= 767) {
      this.closeNav();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
