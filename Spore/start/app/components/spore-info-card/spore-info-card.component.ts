import { Component, OnInit, Input } from 'angular2/core';

@Component({
  selector: 'app-spore-info-card',
  templateUrl: './app/components/spore-info-card/spore-info-card.component.html',
  styleUrls: ['./app/components/spore-info-card/spore-info-card.component.css']
})
export class SporeInfoCardComponent implements OnInit {

  @Input() panelName:string;
  @Input() panelDescription:string;
  @Input() imageUrl:string;

  constructor() { }

  ngOnInit() {
  }

}
