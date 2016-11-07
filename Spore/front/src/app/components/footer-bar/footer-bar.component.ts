/**
 * Created by anatale on 10/28/2016.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent {
  @Input() footerText: string;
}
