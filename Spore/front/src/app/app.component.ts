import { Component } from '@angular/core';
import { LoginPageView } from './views/login-page/login-page.view';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [LoginPageView]
})
export class AppComponent {
  title = 'app works!';
}
