/**
 * Created by anatale on 8/12/2016.
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'sip-info-panel',
    templateUrl: 'app/views/login-page/info-panel/info-panel.view.html',
    styleUrls: ['SIP/frontEnd/src/app/views/login-page/info-panel/info-panel.view.scss'],
    directives: []
})
export class InfoPanelView {
    @Input() panelName:string;
    @Input() panelDescription:string;
    @Input() imageUrl:string;
}
