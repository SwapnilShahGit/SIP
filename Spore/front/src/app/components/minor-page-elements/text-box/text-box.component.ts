import {Component, Input} from '@angular/core';

@Component({
  selector: 'text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['text-box.component.scss']
})

export class TextBoxComponent {
  @Input()
  public placeholderText;
  @Input()
  public fontColor;
  @Input()
  public textboxColor;
  @Input()
  public boxWidth;
  @Input()
  public textboxType = '';
  @Input()
  public textboxBorder;
  @Input()
  public textboxHeight;
  @Input()
  public textboxFontSize;
  @Input()
  public textValue = '';


  constructor(){};
}
