import { Component } from 'angular2/core';
import { LoginPageComponent } from './components/loginPage/loginPage.component';

@Component({
    selector: 'main-component-app',
    templateUrl: './app/app.component.html',
    directives: [LoginPageComponent]
})
export class AppComponent { }

