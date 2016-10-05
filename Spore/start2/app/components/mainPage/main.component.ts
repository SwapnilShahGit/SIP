import { Component, OnInit }  from '@angular/core';

import { IProduct } from './product';
import { MainService } from './product.service';

@Component({
    templateUrl: 'app/components/mainPage/main.component.html',
    styleUrls: ['app/components/mainPage/main.component.css']
})
export class ProductListComponent implements OnInit {
    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: string = '';
    errorMessage: string;
    products: IProduct[];

    constructor(private _mainService: MainService) {

    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    ngOnInit(): void {
           this._mainService.getProducts()
                     .subscribe(
                       products => this.products = products,
                       error =>  this.errorMessage = <any>error);
    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Product List: ' + message;
    }
}
