import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-spore-info-card',
  templateUrl: 'spore-info-card.component.html',
  styleUrls: ['spore-info-card.component.css']
})
export class SporeInfoCardComponent implements OnInit {

  @Input() panelName:string;
  @Input() panelDescription:string;
  @Input() imageUrl:string;

  constructor() { }

  ngOnInit() {
  }

}
