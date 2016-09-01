import { Component } from '@angular/core';
import { SporeFooterBarComponent } from './viewsTemp/spore-footer-bar/spore-footer-bar.component';
import { SporeLoginPageComponent } from './viewsTemp/login-page/spore-login-page/spore-login-page.component';
import { SporeInfoCardComponent } from './viewsTemp/login-page/spore-info-card/spore-info-card.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [SporeFooterBarComponent, SporeLoginPageComponent, SporeInfoCardComponent]
})
export class AppComponent {
  title = 'app works!';
}
