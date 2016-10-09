import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'info-card',
  templateUrl: 'app/components/infoCard/infoCard.component.html',
  styleUrls: ['app/components/infoCard/infoCard.component.css']
})
export class InfoCardComponent implements OnInit {

  @Input() panelName:string;
  @Input() panelDescription:string;
  @Input() imageUrl:string;

  constructor() { }

  ngOnInit() {
  }

}
