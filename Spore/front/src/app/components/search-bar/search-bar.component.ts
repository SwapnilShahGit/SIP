import { Component, HostListener, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @Output()
  private _output = new EventEmitter<String>();

  private _searchText: string = '';

  @HostListener('keydown', ['$event'])
  public enterSearchQuery(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this._output.emit(this._searchText);
    }
  }
}
