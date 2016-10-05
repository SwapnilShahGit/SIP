import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';
import { AppComponent }  from './app.component';
import { LoginComponent } from './components/loginPage/login.component';

/* Feature Modules */
import { ProductModule } from './products/product.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    ProductModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
