import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { UploadService } from '../shared/upload.service';
import { Upload } from '../shared/upload';

@Component({
  selector: 'uploads-list',
  template: `現在のアップされているリスト
<div *ngFor="let upload of uploads | async">
  <upload-detail [upload]='upload'></upload-detail>
</div>

<!-- loading animations ないなら削除でOK -->
<loading-spinner *ngIf="showSpinner"></loading-spinner>

<hr>
アップする時のフォーム
<upload-form></upload-form>`
})
export class UploadsListComponent implements OnInit {

  uploads: FirebaseListObservable<Upload[]>;

  //loading animations用
  showSpinner = true;

  constructor(private upSvc: UploadService) { }

  ngOnInit() {
    //タイムスタンプが新しい順で取得：10件取得
    this.uploads = this.upSvc.getUploads({limitToLast: 10})

    //load end animations off リストが読み込んだらアニメーションをオフにする
    this.uploads.subscribe(() => this.showSpinner = false)
  }

}