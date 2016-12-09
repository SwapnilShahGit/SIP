import {Component, Input} from '@angular/core';

@Component({
  selector: 'third-party-button',
  templateUrl: './third-party-button.component.html',
  styleUrls: ['./third-party-button.component.scss']
})

export class ThirdPartyButton {
  @Input()
  public buttonText;

  @Input()
  public buttonIcon;

  @Input()
  public buttonColor;

  @Input()
  public buttonBorder;

  constructor(){}

}
