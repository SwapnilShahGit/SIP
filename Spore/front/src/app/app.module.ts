import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StaticNavBar } from './components/static-nav/static-nav.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ThirdPartyButton } from './components/ui-components/third-party-button/third-party-button.component';
import { TextBoxComponent } from './components/ui-components/text-box/text-box.component';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { AppRoutingModule } from './app.routes';
import { DatabaseService } from '../meta/database.service';
import { NavService } from '../meta/nav.service';
import { ModeBasedService } from '../meta/modeBased.service';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { ScheduleModule } from 'primeng/primeng';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    FooterBarComponent,
    InfoCardComponent,
    SearchBarComponent,
    StaticNavBar,
    MainPageComponent,
    ThirdPartyButton,
    TextBoxComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ButtonModule,
    CalendarModule,
    ScheduleModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    DatabaseService,
    NavService,
    ModeBasedService
  ]
})
export class AppModule {
}

