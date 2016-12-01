/**
 * Created by anatale on 12/1/2016.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignUpPageComponent {

  constructor(private router: Router){}

  sporeLogin(event: Event) {
    this.router.navigate(['/login']);
    console.log('Back to login');
  }
}
