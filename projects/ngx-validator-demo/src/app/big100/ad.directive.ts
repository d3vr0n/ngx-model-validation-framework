import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, OnInit, ViewChild, Type, Component } from '@angular/core';
// import { Section1Component } from './field-template/section-1.component';

@Directive({
  selector: '[ad-host]',
})
export class AdDirective implements OnInit {

  @Input() model : any;
  @Input() compName : Type<Component>;
  @Input() policy :string;

  @ViewChild(AdDirective, {static: true}) adHost: AdDirective;

  constructor(public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }


  ngOnInit(): void {
    
    // debugger;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.compName);

    const viewContainerRef = this.viewContainerRef;
    //viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<any>componentRef.instance).bigdoc = this.model;
    (<any>componentRef.instance).ORDER_POLICY_NAME = this.policy;

  }
}



/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/