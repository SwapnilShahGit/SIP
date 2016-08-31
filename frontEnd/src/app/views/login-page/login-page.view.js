System.register(['angular2/core', 'primeng/primeng', './info-panel/info-panel.view', '../footer-bar/footer-bar.view'], function(exports_1, context_1) {
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
    var core_1, primeng_1, info_panel_view_1, footer_bar_view_1;
    var LoginPageView;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (primeng_1_1) {
                primeng_1 = primeng_1_1;
            },
            function (info_panel_view_1_1) {
                info_panel_view_1 = info_panel_view_1_1;
            },
            function (footer_bar_view_1_1) {
                footer_bar_view_1 = footer_bar_view_1_1;
            }],
        execute: function() {
            LoginPageView = (function () {
                function LoginPageView() {
                }
                LoginPageView.prototype.sporeLogin = function (event) {
                    console.log('Spore Login');
                };
                LoginPageView.prototype.sporeSignUp = function (event) {
                    console.log('Spore SignUp');
                };
                LoginPageView.prototype.rememberMe = function (event) {
                    console.log('Remember Me');
                };
                LoginPageView.prototype.forgotPassword = function (event) {
                    console.log('Forgot Password?');
                };
                LoginPageView.prototype.facebookLogin = function (event) {
                    console.log('Facebook Login');
                };
                LoginPageView.prototype.googleLogin = function (event) {
                    console.log('Google Login');
                };
                LoginPageView.prototype.linkedinLogin = function (event) {
                    console.log('LinkedIn Login');
                };
                LoginPageView = __decorate([
                    core_1.Component({
                        selector: 'sip-login-page',
                        templateUrl: 'app/views/login-page/login-page.view.html',
                        styleUrls: ['app/views/login-page/login-page.view.scss'],
                        directives: [primeng_1.Schedule, info_panel_view_1.InfoPanelView, footer_bar_view_1.FooterBarView]
                    }), 
                    __metadata('design:paramtypes', [])
                ], LoginPageView);
                return LoginPageView;
            }());
            exports_1("LoginPageView", LoginPageView);
        }
    }
});
//# sourceMappingURL=login-page.view.js.map