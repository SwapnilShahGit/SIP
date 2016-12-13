import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavService {

    // Constants
    CalendarTab: string = 'CalendarTab';
    CalculatorTab: string = 'CalculatorTab';
    CoursesTab: string = 'CoursesTab';
    RemindersTab: string = 'RemindersTab';
    FilesTab: string = 'FilesTab';
    HelpTab: string = 'HelpTab';
    MapTab: string = 'MapTab';
    UserDetailsTab: string = 'UserDetailsTab';
    DefaultTab: string = 'DefaultTab';

    // Observable sources
    private navOpenSource = new Subject<Boolean>();
    
    // Observable streams
    navOpen$ = this.navOpenSource.asObservable();
    
    // Service commands
    toggleNav(isOpen: boolean) {
        this.navOpenSource.next(isOpen);
    }
}