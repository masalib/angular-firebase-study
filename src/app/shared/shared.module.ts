import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDatePipe } from './pipe/chat-date.pipe'; // 追加
import { FormsModule } from '@angular/forms';　// 追加

import { LoadingSpinnerComponent } from '../ui/loading-spinner/loading-spinner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, // 追加
  ],
  declarations: [
    LoadingSpinnerComponent,
      	ChatDatePipe
  ],
  exports: [
    LoadingSpinnerComponent,
        FormsModule,
      	ChatDatePipe
  ]
})
export class SharedModule { }
