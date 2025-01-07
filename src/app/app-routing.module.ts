import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddListComponent } from './add-list/add-list.component';
import { ListComponent } from './list/list.component';
import { EditListComponent } from './edit-list/edit-list.component';
const routes: Routes = [
  { path: 'home', title: '首頁', component: HomeComponent },
  { path: 'addlist', title: '新增', component: AddListComponent },
  { path: 'list', title: '列表', component: ListComponent },
  { path: 'editlist/:id', title: '編輯', component: EditListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
