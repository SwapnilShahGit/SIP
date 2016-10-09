System.register(['angular2/core', './components/loginPage/loginPage.component', './components/mainPage/mainPage.component', 'angular2/router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, loginPage_component_1, mainPage_component_1, router_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (loginPage_component_1_1) {
                loginPage_component_1 = loginPage_component_1_1;
            },
            function (mainPage_component_1_1) {
                mainPage_component_1 = mainPage_component_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    router_1.RouteConfig([
                        { path: '/loginPage', name: 'Login', component: loginPage_component_1.LoginPageComponent, useAsDefault: true },
                        { path: '/mainPage', name: 'Main', component: mainPage_component_1.MainPageComponent }
                    ]),
                    core_1.Component({
                        selector: 'main-component-app',
                        templateUrl: './app/app.component.html',
                        directives: [loginPage_component_1.LoginPageComponent, mainPage_component_1.MainPageComponent, router_1.ROUTER_DIRECTIVES],
                        providers: [router_1.ROUTER_PROVIDERS]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map