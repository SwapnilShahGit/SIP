/**
 * Created by anatale on 10/28/2016.
 */
import { Component } from '@angular/core';


@Component({
  selector: 'left-slide-out',
  templateUrl: 'left-slide-out.component.html',
  styleUrls: ['left-slide-out.component.scss']
})
export class LeftSlideOut {

  private _visible: boolean = true;

  public toggleVisibility(): string {
    return this._visible ? 'visible' : 'hidden';
  }
}
