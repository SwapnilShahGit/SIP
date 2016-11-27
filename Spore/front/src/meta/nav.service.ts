import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavService {

    // Observable sources
    private navOpenSource = new Subject<Boolean>();
    
    // Observable streams
    navOpen$ = this.navOpenSource.asObservable();
    
    // Service commands
    toggleNav(isOpen: boolean) {
        this.navOpenSource.next(isOpen);
    }
}