System.register(['angular2/core', '../spore-info-card/spore-info-card.component', '../footer/footer.component'], function(exports_1, context_1) {
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
    var core_1, spore_info_card_component_1, footer_component_1;
    var LoginPageComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (spore_info_card_component_1_1) {
                spore_info_card_component_1 = spore_info_card_component_1_1;
            },
            function (footer_component_1_1) {
                footer_component_1 = footer_component_1_1;
            }],
        execute: function() {
            LoginPageComponent = (function () {
                function LoginPageComponent() {
                }
                LoginPageComponent.prototype.ngOnInit = function () { };
                LoginPageComponent.prototype.sporeLogin = function (event) {
                    console.log('Spore Login');
                };
                LoginPageComponent.prototype.sporeSignUp = function (event) {
                    console.log('Spore SignUp');
                };
                LoginPageComponent.prototype.rememberMe = function (event) {
                    console.log('Remember Me');
                };
                LoginPageComponent.prototype.forgotPassword = function (event) {
                    console.log('Forgot Password?');
                };
                LoginPageComponent.prototype.facebookLogin = function (event) {
                    console.log('Facebook Login');
                };
                LoginPageComponent.prototype.googleLogin = function (event) {
                    console.log('Google Login');
                };
                LoginPageComponent.prototype.linkedinLogin = function (event) {
                    console.log('LinkedIn Login');
                };
                LoginPageComponent = __decorate([
                    core_1.Component({
                        selector: 'login-page',
                        templateUrl: './app/components/loginPage/loginPage.component.html',
                        styleUrls: ['./app/components/loginPage/loginPage.component.css'],
                        directives: [spore_info_card_component_1.SporeInfoCardComponent, footer_component_1.FooterComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], LoginPageComponent);
                return LoginPageComponent;
            }());
            exports_1("LoginPageComponent", LoginPageComponent);
        }
    }
});
//# sourceMappingURL=loginPage.component.js.map