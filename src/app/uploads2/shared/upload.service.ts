import { Injectable } from '@angular/core';
import { Upload } from './upload';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';


@Injectable()
export class UploadService {

  constructor(private db: AngularFireDatabase) { }

  //firebaseのDBの保存先
  private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;


  getUploads(query={}) {
    this.uploads = this.db.list(this.basePath, {
      query: query
    });
    return this.uploads
  }


  deleteUpload(upload: Upload) {
    //DBの部分を削除
    this.deleteFileData(upload.$key)
    .then( () => {
      //成功したらバケットにある実ファイルを削除する
      this.deleteFileStorage(upload.name)
    })
    .catch(error => console.log(error))
  }

  // ファイルをアップして、その内容をDBに書き込む処理
  // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
  pushUpload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress(アップロード中の状態)
        let snap = snapshot as firebase.storage.UploadTaskSnapshot
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success（アップロード成功時の処理）
        upload.url = uploadTask.snapshot.downloadURL	//表示する時のURL
        upload.name = upload.file.name	//ファイル名
        this.saveFileData(upload)
        return undefined
      }
    );
  }



  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }

  // Writes the file details to the realtime db
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name:string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }


}