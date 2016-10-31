/**
 * Created by anatale on 10/28/2016.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {

  @Input() panelName:string;
  @Input() panelDescription:string;
  @Input() imageLocation:string;

}
