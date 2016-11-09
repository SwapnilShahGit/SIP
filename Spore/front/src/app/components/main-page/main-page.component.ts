import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';
import { Http, Response } from '@angular/http';
import { DatabaseService } from '../../../meta/database.service';
import { User } from '../../../meta/User';
import { TabsHelper } from '../../../meta/tabsHelper';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private SelectedSchool: string = "Please select your school";
  private _color: string = '';
  private CurrentTab: string;
  private _slideWidth: string;
  private _slideLeft: string;

  private echoResponse: string = '...';
  private echoInput: string = 'echo';
  userID: string;
  user: User;
  profileImage: string;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private databaseService: DatabaseService,
    private tabsHelper: TabsHelper
  ) { this.CurrentTab = tabsHelper.DefaultTab; }

  ngOnInit() {
    console.log('_______ in main _______');
    this.activatedRouter.params.forEach((params: Params) => {
      if(params['id'] !== undefined) {
        this.userID = params['id'];
        this.databaseService.getUser(this.userID)
          .then(user => {
            this.user = user;
            this.profileImage = this.user.Email; // for now...
          });
      }
    });
    this.openNav();
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
}