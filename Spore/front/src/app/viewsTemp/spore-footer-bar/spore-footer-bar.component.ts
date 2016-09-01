import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-spore-footer-bar',
  templateUrl: './spore-footer-bar.component.html',
  styleUrls: ['./spore-footer-bar.component.css']
})
export class SporeFooterBarComponent implements OnInit {

  @Input() footerText:string;
  @Input() imageUrl:string;

  constructor() { }

  ngOnInit() {
  }

}
