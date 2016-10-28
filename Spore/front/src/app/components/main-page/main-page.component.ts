/**
 * Created by anatale on 10/28/2016.
 */
import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private SelectedSchool: string = "Please select your school";
  private CurrentTab: string = "TabMap";
  private _slideWidth: string;
  private _slideLeft: string;

  ngOnInit() {
    this.openNav();
  }

  constructor(private _router: Router) {
  }

  public navigateToLoginPage() {
    this._router.navigate(['/login']);
  }

  public selectUofT() {
    this.SelectedSchool = "University of Toronto";
  }

  public selectSheridan() {
    this.SelectedSchool = "Sheridan College";
  }

  public selectNoSchool() {
    this.SelectedSchool = "Ain't got no time for that";
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
