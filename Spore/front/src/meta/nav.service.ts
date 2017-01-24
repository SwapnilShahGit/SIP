import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavService {

    // Constants
    public CalendarTab: string = 'CalendarTab';
    public CalculatorTab: string = 'CalculatorTab';
    public CoursesTab: string = 'CoursesTab';
    public RemindersTab: string = 'RemindersTab';
    public FilesTab: string = 'FilesTab';
    public HelpTab: string = 'HelpTab';
    public MapTab: string = 'MapTab';
    public SettingsTab: string = 'SettingsTab';
    public DefaultTab: string = 'DefaultTab';

    // Observable sources
    private navOpenSource = new Subject<Boolean>();

    // Observable streams
    navOpen$ = this.navOpenSource.asObservable();

    // Service commands
    public toggleNav(isOpen: boolean) {
        this.navOpenSource.next(isOpen);
    }
}
