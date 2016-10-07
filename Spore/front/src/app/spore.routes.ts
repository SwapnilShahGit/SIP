/**
 * Created by anatale on 9/22/2016.
 */
import {provideRouter, RouterConfig} from '@angular/router';
import {SporeLoginPageComponent} from "./viewsTemp/login-page/spore-login-page/spore-login-page.component";
import {SporeMainPageComponent} from "./viewsTemp/main-page/spore-main-page/spore-main-page.component";
export const loginRoutes: RouterConfig = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    canActivate: [],
    path: 'login',
    component: SporeLoginPageComponent
  },
  {
    canActivate: [],
    path: 'main-page',
    component: SporeMainPageComponent
  }
];

export const APP_ROUTER_PROVIDERS = [provideRouter(loginRoutes)];
