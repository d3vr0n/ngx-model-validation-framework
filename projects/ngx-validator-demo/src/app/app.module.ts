import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {MatCardModule, MatGridListModule,MatFormFieldModule,MatRadioModule,MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatTabsModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxValidationModule } from 'ngx-model-validator';
import { SimpleComponent } from './simple/simple.component';
import { TabbedComponent } from './tabbed/tabbed.component';
import { Big100Component } from './big100/big100.component';
import { GroupComponent } from './group/group.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleComponent,
    TabbedComponent,
    Big100Component,
    GroupComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,FormsModule,
    NgxValidationModule,
    SimpleNotificationsModule.forRoot(),
    MatCardModule,MatGridListModule,MatFormFieldModule,MatRadioModule,MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
