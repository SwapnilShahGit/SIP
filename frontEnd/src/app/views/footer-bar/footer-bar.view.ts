/**
 * Created by anatale on 8/17/2016.
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'sip-footer-bar',
    templateUrl: 'app/views/footer-bar/footer-bar.view.html',
    styleUrls: ['app/views/footer-bar/footer-bar.view.scss'],
    directives: []
})
export class FooterBarView {
    @Input() footerText:string;
    @Input() imageUrl:string;
}
