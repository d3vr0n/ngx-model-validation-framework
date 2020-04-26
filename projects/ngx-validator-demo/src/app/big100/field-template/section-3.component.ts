import { Component, Input, OnInit } from '@angular/core';

@Component({
 templateUrl : './section-3.component.html'
})
export class Section3Component implements OnInit {
  @Input() bigdoc: any;
  @Input ('policy') ORDER_POLICY_NAME : any;

  showSectionErrorStatus = true;

  constructor(){}
    ngOnInit(): void {
        
        let x = this.ORDER_POLICY_NAME;
    }

    handleGroupValidationStatusChange(payload) {
      if(payload.section === 'section3') {
        if(payload.isValid === 'valid') {
          this.showSectionErrorStatus = false;
        } else {
          this.showSectionErrorStatus = true;
        }
      }
    }

}