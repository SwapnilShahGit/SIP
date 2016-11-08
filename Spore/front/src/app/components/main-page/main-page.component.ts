import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { Http, Response } from '@angular/http';

import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/User';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private SelectedSchool: string = "Please select your school";
  private _color: string = '';
  private CurrentTab: string = "DefaultTab";
  private _slideWidth: string;
  private _slideLeft: string;

  private echoResponse: string = '...';
  private echoInput: string = 'echo';
  userId: string;
  user: User;
  profileImage: string;

  constructor(
    private _router: Router,
    private Rt: ActivatedRoute,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    console.log('_______ in main _______');
    this.Rt.params.forEach((params: Params) => {
      console.log(params);
      if (params['id'] !== undefined) {
        this.userId = params['id'];
        this.databaseService.getUser(this.userId)
          .then(user => {
            console.log(user);
            this.user = new User(user.UserId, undefined, user.FirstName, user.LastName, undefined, user.Email);
            console.log('email: ' + this.user.email);
            this.profileImage = this.user.email;
          });
      } else {
        this.user = new User();
      }
    });
    
    this.openNav();
  }

  echoTester() {
    this.databaseService.echo(this.echoInput).then(data => this.echoResponse = data);
  }

  public navigateToLoginPage() {
    this._router.navigate(['/login']);
  }

  public selectUofT() {
    this.SelectedSchool = "University of Toronto";
    this._color = 'light-blue';
  }

  public selectSheridan() {
    this.SelectedSchool = "Sheridan College";
    this._color = 'navy-blue';
  }

  public selectNoSchool() {
    this.SelectedSchool = "Ain't got no time for that";
    this._color = 'green';
  }

  public openNav() {
    this._slideWidth = '250px';
    this._slideLeft = '250px';
  }

  public closeNav() {
    this._slideWidth = '0px';
    this._slideLeft = '0px';
  }

  public selectTabCalendar() {
    this.CurrentTab = "TabCalendar";
  }

  public selectTabCalculator() {
    this.CurrentTab = "TabCalculator";
  }

  public selectTabCourses() {
    this.CurrentTab = "TabCourses";
  }

  public selectTabReminders() {
    this.CurrentTab = "TabReminders";
  }

  public selectTabFiles() {
    this.CurrentTab = "TabFiles";
  }

  public selectTabHelp() {
    this.CurrentTab = "TabHelp";
  }

  public selectTabMap() {
    this.CurrentTab = "TabMap";
  }

  public selectTabDefault() {
    this.CurrentTab = "DefaultTab";
  }
}