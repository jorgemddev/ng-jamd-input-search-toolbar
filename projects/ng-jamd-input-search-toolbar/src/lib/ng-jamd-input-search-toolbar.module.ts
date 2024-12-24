import { NgModule } from '@angular/core';
import { NgJamdInputSearchToolbarComponent } from './ng-jamd-input-search-toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    NgJamdInputSearchToolbarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    NgJamdInputSearchToolbarComponent
  ]
})
export class NgJamdInputSearchToolbarModule { }
