import { Component, Input, OnInit } from '@angular/core';

@Component({
 templateUrl : './section-10.component.html'
})
export class Section10Component implements OnInit {
  @Input() bigdoc: any;
  @Input ('policy') ORDER_POLICY_NAME : any;

  constructor(){}
    ngOnInit(): void {
        
        let x = this.ORDER_POLICY_NAME;
    }

}