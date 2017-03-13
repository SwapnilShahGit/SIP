/**
 * Created by anatale on 2/9/2017.
 */
import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'spore-dialog',
  templateUrl: './spore-dialog.component.html',
  styleUrls: ['./spore-dialog.component.scss']
})

export class SporeDialogComponent {

  @Output()
  public closeDialog: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public showDialog = false;

  public close() {
    this.closeDialog.emit(true);
  }
}
