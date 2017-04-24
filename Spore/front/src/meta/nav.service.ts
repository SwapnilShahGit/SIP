import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavService {

    // Observable sources
    public navOpenSource = new Subject<Boolean>();

    // Observable streams
    public navOpen$ = this.navOpenSource.asObservable();

    // Service commands
    public toggleNav(isOpen: boolean) {
        this.navOpenSource.next(isOpen);
    }
}
