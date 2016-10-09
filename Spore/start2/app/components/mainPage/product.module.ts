import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { productRouting } from './product.routing';
import { MainComponent } from './main.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductFilterPipe } from './product-filter.pipe';
import { MainService } from './product.service';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    productRouting
  ],
  declarations: [
    MainComponent,
    ProductDetailComponent,
    ProductFilterPipe,
  ],
  providers: [
    MainService
  ]
})
export class ProductModule {}
