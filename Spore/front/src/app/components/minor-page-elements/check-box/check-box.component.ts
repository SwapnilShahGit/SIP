/**
 * Created by anatale on 11/29/2016.
 */
import {Component, Input} from '@angular/core';

@Component({
  selector: 'check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})

export class CheckBoxComponent {
  @Input()
  public checkboxText;
  @Input()
  public fontWeight;
  @Input()
  public fontColor;
}
