import { Component } from '@angular/core';

@Component({
    selector: 'calculator-page',
    templateUrl: './calculator-page.component.html',
    styleUrls: ['./calculator-page.component.scss']
})

export class CalculatorComponent {

    private currentGPA: number = 0;
    private grades: number[] = [];

    public updateGPA(newNum: number) {
        this.grades.push(newNum);
        this.currentGPA = Math.round((this.grades.reduce((total, num) => {return total + num}) / this.grades.length) * 10) / 10;
    }

    public reset() {
        this.grades = [];
        this.currentGPA = 0;
    }

}
