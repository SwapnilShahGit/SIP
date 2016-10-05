import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarComponent } from './star.component';
import { FooterComponent } from '../components/footer/footer.component';


@NgModule({
  imports: [ CommonModule ],
  exports : [
    CommonModule,
    StarComponent,
    FooterComponent
  ],
  declarations: [ 
    StarComponent,
    FooterComponent
 ],
})
export class SharedModule { }
