import { Component, OnInit } from '@angular/core';
import { Comment, User } from './chat';　// パスを調整
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from "../core/auth.service";


//const CURRENT_USER: User = new User(1, 'Tanaka Jiro');
//const ANOTHER_USER: User = new User(2, 'Suzuki Taro');

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  public FB_comments: FirebaseListObservable<any[]>;
  public content = '';
  public comments: Comment[] = [];
  public current_user = '';

  constructor(private db: AngularFireDatabase ,public auth: AuthService){ } // praivateを追加

  ngOnInit() { // コンストラクタの内容を移す
    this.FB_comments = this.db.list('/comments'); // thisを追加
    this.FB_comments.subscribe((snapshots: any[]) => {
      this.comments = [];
      snapshots.forEach((snapshot: any) => {
        this.comments.push(new Comment(snapshot.user, snapshot.content).setData(snapshot));
      });
    });
  }

  // 新しいコメントを追加
  addComment(comment: string) {
     if (comment) {

       this.FB_comments.push(new Comment(new User(this.auth.currentUserId,this.auth.currentUserDisplayName), comment));
       this.content = '';
     }
  }

  // 編集フィールドの切り替え
  toggleEditComment(num: number) {
    this.comments[num].edit_flag = (this.comments[num].edit_flag) ? false : true;
  }

  // コメントを更新する
  saveEditComment(num: number, key: string) {
    this.FB_comments.update(key, {
      content: this.comments[num].content,
      date: this.comments[num].date
    }).then( () => {
      alert('コメントを更新しました');
      this.comments[num].edit_flag = false;
    });
  }

  // コメントをリセットする
  resetEditComment(num: number) {
    this.comments[num].content = '';
  }

  // コメントを削除する
  deleteComment(key: string) {
    this.FB_comments.remove(key).then(() => {
      alert('コメントを削除しました');
    });
  }

}
