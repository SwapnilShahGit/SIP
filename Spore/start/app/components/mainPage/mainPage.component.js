System.register(['angular2/core', '../loginPage/loginPage.component', '../footer/footer.component'], function(exports_1, context_1) {
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
    var core_1, loginPage_component_1, footer_component_1;
    var MainPageComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (loginPage_component_1_1) {
                loginPage_component_1 = loginPage_component_1_1;
            },
            function (footer_component_1_1) {
                footer_component_1 = footer_component_1_1;
            }],
        execute: function() {
            MainPageComponent = (function () {
                function MainPageComponent() {
                    this._leftSlideOut = false;
                    this._rightSlideOut = false;
                    this._notificationsVisible = true;
                    this._notificationCount = 0;
                    this._events = [
                        {
                            "title": "All Day Event",
                            "start": "2016-01-01"
                        },
                        {
                            "title": "Long Event",
                            "start": "2016-01-07",
                            "end": "2016-01-10"
                        },
                        {
                            "title": "Repeating Event",
                            "start": "2016-01-09T16:00:00"
                        },
                        {
                            "title": "Repeating Event",
                            "start": "2016-01-16T16:00:00"
                        },
                        {
                            "title": "Conference",
                            "start": "2016-01-11",
                            "end": "2016-01-13"
                        }
                    ];
                }
                MainPageComponent.prototype.ngOnInit = function () { };
                MainPageComponent.prototype.notifiedUser = function ($event) {
                    this._notificationCount += 1;
                };
                MainPageComponent.prototype.temp = function () {
                    if (this._notificationCount > 9) {
                        return '9+';
                    }
                    return this._notificationCount.toString();
                };
                MainPageComponent.prototype.setLeftSlide = function () {
                    return this._leftSlideOut ? 'visible' : 'hidden';
                };
                MainPageComponent.prototype.setLeftDownSlide = function () {
                    return this._leftSlideOut ? 'hidden' : 'visible';
                };
                MainPageComponent.prototype.setRightSlide = function () {
                    return this._rightSlideOut ? 'visible' : 'hidden';
                };
                MainPageComponent.prototype.setRightDownSlide = function () {
                    return this._rightSlideOut ? 'hidden' : 'visible';
                };
                MainPageComponent.prototype.leftSlideButton = function () {
                    this._leftSlideOut = !this._leftSlideOut;
                };
                MainPageComponent.prototype.rightSlideButton = function () {
                    this._rightSlideOut = !this._rightSlideOut;
                };
                MainPageComponent.prototype.setNotificationsVisibility = function () {
                    this._notificationsVisible = !this._notificationsVisible;
                };
                MainPageComponent.prototype.notificationsVisibility = function () {
                    return this._notificationsVisible ? 'visible' : 'hidden';
                };
                MainPageComponent = __decorate([
                    //this doesnt work when you add it as a directive...
                    core_1.Component({
                        selector: 'main-page',
                        templateUrl: './app/components/mainPage/mainPage.component.html',
                        styleUrls: ['./app/components/mainPage/mainPage.component.css'],
                        directives: [loginPage_component_1.LoginPageComponent, footer_component_1.FooterComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], MainPageComponent);
                return MainPageComponent;
            }());
            exports_1("MainPageComponent", MainPageComponent);
        }
    }
});
//# sourceMappingURL=mainPage.component.js.map