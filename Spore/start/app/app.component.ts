import { Component } from 'angular2/core';
import { LoginPageComponent } from './components/loginPage/loginPage.component';

@Component({
    selector: 'main-component-app',
    template: `
    <div>
        <h1>{{pageTitle}}</h1>
        <div>MyFirstComponent</div>
        <login-page>Loading login page...</login-page>
    </div>
    `,
    directives: [LoginPageComponent]
})
export class AppComponent {
    pageTitle: string = 'Some Title';
}

