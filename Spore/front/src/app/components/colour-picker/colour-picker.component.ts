import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.scss']
})

export class CustomColourPickerComponent {

  private colourValue = "#0000ff";
  private width: number = 25;
  private height: number = 25;
  private borderRadius: number = 50;
  private defaultColours = [
    '#33cccc',
    '#99cc99',
    '#cc99cc',
    '#fabf8f',
    '#bfbfbf',
    '#6699ff',
    '#ff6666',
    '#ffcc66'
  ];

  @Input()
  public buttonColour;

  @Input()
  public dropdownClass;

  @Input()
  public buttonClass;

  @Input()
  public get colour() {
    return this.colourValue;
  }

  @Output() colourChange = new EventEmitter();

  public set colour(colour) {
    this.colourValue = colour;
    this.colourChange.emit(this.colourValue);
  }

  public setColour(colour) {
    this.colourValue = colour;
    this.colourChange.emit(this.colourValue);
  }

}
