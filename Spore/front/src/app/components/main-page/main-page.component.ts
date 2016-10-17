import { StaticNavBar } from '../static-nav/static-nav.component';
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FooterBarComponent } from '../footer-bar/footer-bar.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  constructor(private _router: Router) {
  }

  public navigateToLoginPage() {
    this._router.navigate(['/login']);
  }
  
}
