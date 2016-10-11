import { Component } from '@angular/core';
import { StaticNavBar } from '../static-nav/static-nav.component';
import { Router } from "@angular/router";

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