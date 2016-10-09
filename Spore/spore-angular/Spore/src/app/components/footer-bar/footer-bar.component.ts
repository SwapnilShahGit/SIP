import { Component, OnInit, Input } from '@angular/core';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit {

  @Input() footerText:string;
  @Input() imageUrl:string;

  constructor() { }

  ngOnInit() {
  }

}
