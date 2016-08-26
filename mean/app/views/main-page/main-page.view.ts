import {Component} from 'angular2/core';
import {Schedule} from 'primeng/primeng';

@Component({
    selector: 'sip-main-page',
    templateUrl: 'app/views/main-page/main-page.view.html',
    styleUrls: ['app/views/main-page/main-page.view.scss'],
    directives: [Schedule]
})
export class MainPageView {
}