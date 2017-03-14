import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StaticNavBar } from './components/static-nav/static-nav.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CheckBoxComponent } from './components/minor-page-elements/check-box/check-box.component';
import { ThirdPartyButton }
from './components/minor-page-elements/third-party-button/third-party-button.component';
import { TextBoxComponent } from './components/minor-page-elements/text-box/text-box.component';
import { SignUpPageComponent } from './components/signup-page/signup-page.component';
import { CalendarModule, DialogModule, ButtonModule, ScheduleModule } from 'primeng/primeng';
import { AppRoutingModule } from './app.routes';
import { DatabaseService } from '../meta/database.service';
import { NavService } from '../meta/nav.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UploadComponent } from './components/upload/upload.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { ColorPickerModule } from 'angular2-color-picker';
import { FriendsPageComponent } from './components/friends-page/friends-page.component';
import { SporeDialogComponent } from './components/minor-page-elements/spore-dialog/spore-dialog.component';
import { CookieService } from 'angular2-cookie';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  CookieService
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
    TextBoxComponent,
    CheckBoxComponent,
    SignUpPageComponent,
    CalendarComponent,
    SettingsComponent,
    UploadComponent,
    FileSelectDirective,
    FileDropDirective,
    FriendsPageComponent,
    SporeDialogComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ButtonModule,
    CalendarModule,
    ScheduleModule,
    DialogModule,
    ColorPickerModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    DatabaseService,
    NavService,
  ]
})
export class AppModule {
}

