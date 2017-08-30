import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '../shared/upload.service';
import { Upload } from '../shared/upload';

@Component({
  selector: 'upload-detail',
  template: `
<strong>{{upload.name}}</strong>
<button (click)='deleteUpload(upload)' class="button is-danger is-small">Delete</button><br>
`
})
export class UploadDetailComponent implements OnInit {

  @Input() upload: Upload;

  constructor(private upSvc: UploadService) { }

  ngOnInit() {
  }
  //削除ボタンを押された時の処理（確認画面もなく削除される・・・あとで修正）
  deleteUpload(upload) {
    this.upSvc.deleteUpload(this.upload)
  }

}