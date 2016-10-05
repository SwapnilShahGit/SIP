import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { ProductListComponent } from './main.component';
import { ProductDetailComponent } from './product-detail.component';

export const productRoutes: Routes = [
  { path: 'main', component: ProductListComponent },
  { path: 'main/:id', component: ProductDetailComponent }
];

export const productRouting: ModuleWithProviders =
                RouterModule.forChild(productRoutes);
