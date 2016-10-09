import { Component } from '@angular/core';
import { InfoCardComponent } from '../infoCard/infoCard.component';

@Component({
    templateUrl: 'app/components/loginPage/login.component.html',
    styleUrls: ['app/components/loginPage/login.component.css'],
    directives: [InfoCardComponent]
})
export class LoginComponent {
    public pageTitle: string = 'Login';
}
