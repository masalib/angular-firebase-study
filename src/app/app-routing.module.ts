import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

import { UserLoginComponent } from './ui/user-login/user-login.component';
import { ItemsListComponent } from './items/items-list/items-list.component';
// import { UploadsListComponent } from './uploads/uploads-list/uploads-list.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';

import { CoreModule } from './core/core.module'

import { ChatComponent } from './chat/chat.component';
import { TextTranslateComponent } from './text-translate/text-translate.component';

const routes: Routes = [
  { path: '', component: ReadmePageComponent },
  { path: 'login', component: UserLoginComponent, },
  { path: 'chat', component: ChatComponent, },
  { path: 'text-translate', component: TextTranslateComponent, },
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard]},
  { path: 'uploads', loadChildren: "./uploads/shared/upload.module#UploadModule" },
  { path: 'uploads2', loadChildren: "./uploads2/shared/upload.module#UploadModule2" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
