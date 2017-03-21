import { Component, Input } from '@angular/core';

@Component({
  selector: 'footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent {
  @Input()
  public footerColour: string = '#2c5268';
}
