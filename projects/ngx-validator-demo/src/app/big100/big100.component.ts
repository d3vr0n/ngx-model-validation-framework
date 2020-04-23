import { Component, OnInit, ComponentFactoryResolver, ViewChild, Type } from '@angular/core';
import { NgxValidationRunnerService } from 'ngx-model-validator';
import { Big100ValidationPolicy } from './big100.validation.policy';

import { Section1Component } from './field-template/section-1.component';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { SimpleComponent } from '../simple/simple.component';
import { Section2Component } from './field-template/section-2.component';
import { Section3Component } from './field-template/section-3.component';
import { Section4Component } from './field-template/section-4.component';
import { Section5Component } from './field-template/section-5.component';
import { Section6Component } from './field-template/section-6.component';
import { Section7Component } from './field-template/section-7.component';
import { Section8Component } from './field-template/section-8.component';
import { Section9Component } from './field-template/section-9.component';
import { Section10Component } from './field-template/section-10.component';
import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-big100',
  templateUrl: './big100.component.html',
  styleUrls: ['./big100.component.css']
})
export class Big100Component implements OnInit {
  // TODO : follow https://stackblitz.com/angular/bekxqjgareq?file=src%2Fapp%2Fad.service.ts
  // https://material.angular.io/cdk/scrolling/overview
  // following https://angular.io/guide/dynamic-component-loader

  public ORDER_POLICY_NAME = 'big100-validation-policy';
  public ORDER_VALIDATION_FN = Big100ValidationPolicy;
  public componentList : Array<Type<Component>>;

  public bigdoc = {
    section1:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section2:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section3:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section4:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section5:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section6:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section7:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section8:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section9:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    },
    section10:{
      label1:'',
      label2:'',
      label3:'',
      label4:'',
      label5:'',
      label6:'',
      label7:'',
      label8:'',
      label9:'',
      label10:'',
    }
  }

  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);

  constructor(private valRunnerSvc: NgxValidationRunnerService) { }

  validate() {

    this.valRunnerSvc.validate(this.ORDER_POLICY_NAME, this.bigdoc).subscribe(result => {
      if (result && result.length > 0) {
        console.error('Validation error found');
      }
    });

  }

  ngOnInit() {
    this.componentList = this.getComponentList();

    this.loadComponent();
  }

  getComponentList() {
    return <Array<Type<Component>>>[
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
      Section1Component,
      // SimpleComponent,
      // GroupComponent,
    ];
  }

  loadComponent() {

    
  }

}

export class MyDataSource extends DataSource<string | undefined> {
  private _length = 100000;
  private _pageSize = 100;
  private _cachedData = Array.from<string>({length: this._length});
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(string | undefined)[]>(this._cachedData);
  private _subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    this._subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this._getPageForIndex(range.start);
      const endPage = this._getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this._fetchPage(i);
      }
    }));
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      this._cachedData.splice(page * this._pageSize, this._pageSize,
          ...Array.from({length: this._pageSize})
              .map((_, i) => `Item #${page * this._pageSize + i}`));
      this._dataStream.next(this._cachedData);
    }, Math.random() * 1000 + 200);
  }
}
