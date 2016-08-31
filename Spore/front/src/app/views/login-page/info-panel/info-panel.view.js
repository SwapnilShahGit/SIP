System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var InfoPanelView;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            InfoPanelView = (function () {
                function InfoPanelView() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], InfoPanelView.prototype, "panelName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], InfoPanelView.prototype, "panelDescription", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], InfoPanelView.prototype, "imageUrl", void 0);
                InfoPanelView = __decorate([
                    core_1.Component({
                        selector: 'sip-info-panel',
                        templateUrl: 'app/views/login-page/info-panel/info-panel.view.html',
                        styleUrls: ['app/views/login-page/info-panel/info-panel.view.scss'],
                        directives: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], InfoPanelView);
                return InfoPanelView;
            }());
            exports_1("InfoPanelView", InfoPanelView);
        }
    }
});
//# sourceMappingURL=info-panel.view.js.map