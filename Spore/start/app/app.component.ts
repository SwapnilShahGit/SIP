import { Component } from 'angular2/core';
import { LoginPageComponent } from './components/loginPage/loginPage.component';
import { MainPageComponent } from './components/mainPage/mainPage.component';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';

@RouteConfig([
    { path: '/loginPage', name: 'Login', component: LoginPageComponent, useAsDefault: true },
    { path: '/mainPage', name: 'Main', component: MainPageComponent }
])

@Component({
    selector: 'main-component-app',
    templateUrl: './app/app.component.html',
    directives: [LoginPageComponent, MainPageComponent, ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
export class AppComponent { }

