import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from '../index/index.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [IndexComponent],
  imports: [CommonModule,
            NgbModule,
  ],
  exports: [IndexComponent]
})
export class SharedModule { }
