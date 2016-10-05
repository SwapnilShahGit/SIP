import { Component, OnInit }  from '@angular/core';

import { IProduct } from './product';
import { MainService } from './product.service';

@Component({
    templateUrl: 'app/components/mainPage/main.component.html',
    styleUrls: ['app/components/mainPage/main.component.css']
})
export class MainComponent implements OnInit {
    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: string = '';
    errorMessage: string;
    products: IProduct[];

    private _leftSlideOut: boolean = false;
    private _rightSlideOut: boolean = false;
    private _notificationsVisible: boolean = true;
    private _notificationCount: number = 0;

    constructor(private _mainService: MainService) {

    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    ngOnInit(): void {
        this._mainService.getProducts()
            .subscribe(
            products => this.products = products,
            error => this.errorMessage = <any>error);
    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Product List: ' + message;
    }

    public notifiedUser($event: Event) {
        this._notificationCount += 1;
    }

    public temp() {
        if (this._notificationCount > 9) {
            return '9+';
        }
        return this._notificationCount.toString();
    }

    public setLeftSlide(): string {
        return this._leftSlideOut ? 'visible' : 'hidden';
    }

    public setLeftDownSlide(): string {
        return this._leftSlideOut ? 'hidden' : 'visible';
    }

    public setRightSlide(): string {
        return this._rightSlideOut ? 'visible' : 'hidden';
    }

    public setRightDownSlide(): string {
        return this._rightSlideOut ? 'hidden' : 'visible';
    }

    public leftSlideButton() {
        this._leftSlideOut = !this._leftSlideOut;
    }

    public rightSlideButton() {
        this._rightSlideOut = !this._rightSlideOut;
    }

    public setNotificationsVisibility() {
        this._notificationsVisible = !this._notificationsVisible;
    }

    public notificationsVisibility(): string {
        return this._notificationsVisible ? 'visible' : 'hidden';
    }
}
