import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'info-card',
  templateUrl: 'infoCard.component.html',
  styleUrls: ['infoCard.component.css']
})
export class SporeInfoCardComponent implements OnInit {

  @Input() panelName:string;
  @Input() panelDescription:string;
  @Input() imageUrl:string;

  constructor() { }

  ngOnInit() {
  }

}
