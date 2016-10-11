import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AppRoutingModule } from './app.routing';
import { StaticNavBar } from './components/static-nav/static-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    InfoCardComponent,
    FooterBarComponent,
    MainPageComponent,
    StaticNavBar
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
