import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleComponent } from './simple/simple.component';
import { TabbedComponent } from './tabbed/tabbed.component';
import { GroupComponent } from './group/group.component';
import { Big100Component } from './big100/big100.component';
import { BootstrapFormComponent } from './bootstrap-form/bootstrap-form.component';


const routes: Routes = [
  { path: 'simple', component: SimpleComponent },
  { path: 'tabbed', component: TabbedComponent },
  { path: 'group', component: GroupComponent },
  { path: 'big100', component: Big100Component },
  { path: 'bs-form', component: BootstrapFormComponent },
  { path: '', redirectTo: 'simple', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
