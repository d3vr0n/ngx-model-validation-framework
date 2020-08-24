import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule} from '@angular/material/select';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxValidationModule } from 'ngx-model-validator';
import { SimpleComponent } from './simple/simple.component';
import { TabbedComponent } from './tabbed/tabbed.component';
import { Big100Component } from './big100/big100.component';
import { GroupComponent } from './group/group.component';
import { BootstrapFormComponent } from './bootstrap-form/bootstrap-form.component';
import { AdDirective } from './big100/ad.directive';
import { Section1Component } from './big100/field-template/section-1.component';
import { Section2Component } from './big100/field-template/section-2.component';
import { Section3Component } from './big100/field-template/section-3.component';
import { Section4Component } from './big100/field-template/section-4.component';
import { Section5Component } from './big100/field-template/section-5.component';
import { Section6Component } from './big100/field-template/section-6.component';
import { Section7Component } from './big100/field-template/section-7.component';
import { Section8Component } from './big100/field-template/section-8.component';
import { Section9Component } from './big100/field-template/section-9.component';
import { Section10Component } from './big100/field-template/section-10.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleComponent,
    TabbedComponent,
    Big100Component,
    GroupComponent,
    BootstrapFormComponent,
    AdDirective, 
    
    Section1Component,
    Section2Component,
    Section3Component,
    Section4Component,
    Section5Component,
    Section6Component,
    Section7Component,
    Section8Component,
    Section9Component,
    Section10Component,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,FormsModule,
    NgxValidationModule, MatIconModule, CdkScrollableModule, ScrollingModule,
    SimpleNotificationsModule.forRoot(),
    MatCardModule,MatGridListModule,MatFormFieldModule,MatRadioModule,MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [Section1Component,
    Section2Component,
    Section3Component,
    Section4Component,
    Section5Component,
    Section6Component,
    Section7Component,
    Section8Component,
    Section9Component,
    Section10Component,]
})
export class AppModule { }
