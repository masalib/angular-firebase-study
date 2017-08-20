import { Component } from '@angular/core';
import { TranslateService } from './translate.service';
@Component({
  selector: 'text-translate',
  providers: [TranslateService],
  templateUrl: './text-translate.component.html',
  styleUrls: ['./text-translate.component.scss']
})

export class TextTranslateComponent {

  userText: string;
  currentTranslation;

  constructor(private translateSvc: TranslateService) { }

  handleTranslation() {
    this.currentTranslation = this.translateSvc.createTranslation(this.userText)
  }

  defaultMessage() {
    if (!this.currentTranslation) return "英語で入力して翻訳のボタンを押してください"
    else return "翻訳中です・・・"
  }

}
