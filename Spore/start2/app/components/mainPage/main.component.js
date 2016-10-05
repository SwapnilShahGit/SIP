"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var product_service_1 = require('./product.service');
var MainComponent = (function () {
    function MainComponent(_mainService) {
        this._mainService = _mainService;
        this.pageTitle = 'Product List';
        this.imageWidth = 50;
        this.imageMargin = 2;
        this.showImage = false;
        this.listFilter = '';
        this._leftSlideOut = false;
        this._rightSlideOut = false;
        this._notificationsVisible = true;
        this._notificationCount = 0;
    }
    MainComponent.prototype.toggleImage = function () {
        this.showImage = !this.showImage;
    };
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._mainService.getProducts()
            .subscribe(function (products) { return _this.products = products; }, function (error) { return _this.errorMessage = error; });
    };
    MainComponent.prototype.onRatingClicked = function (message) {
        this.pageTitle = 'Product List: ' + message;
    };
    MainComponent.prototype.notifiedUser = function ($event) {
        this._notificationCount += 1;
    };
    MainComponent.prototype.temp = function () {
        if (this._notificationCount > 9) {
            return '9+';
        }
        return this._notificationCount.toString();
    };
    MainComponent.prototype.setLeftSlide = function () {
        return this._leftSlideOut ? 'visible' : 'hidden';
    };
    MainComponent.prototype.setLeftDownSlide = function () {
        return this._leftSlideOut ? 'hidden' : 'visible';
    };
    MainComponent.prototype.setRightSlide = function () {
        return this._rightSlideOut ? 'visible' : 'hidden';
    };
    MainComponent.prototype.setRightDownSlide = function () {
        return this._rightSlideOut ? 'hidden' : 'visible';
    };
    MainComponent.prototype.leftSlideButton = function () {
        this._leftSlideOut = !this._leftSlideOut;
    };
    MainComponent.prototype.rightSlideButton = function () {
        this._rightSlideOut = !this._rightSlideOut;
    };
    MainComponent.prototype.setNotificationsVisibility = function () {
        this._notificationsVisible = !this._notificationsVisible;
    };
    MainComponent.prototype.notificationsVisibility = function () {
        return this._notificationsVisible ? 'visible' : 'hidden';
    };
    MainComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/mainPage/main.component.html',
            styleUrls: ['app/components/mainPage/main.component.css']
        }), 
        __metadata('design:paramtypes', [product_service_1.MainService])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map