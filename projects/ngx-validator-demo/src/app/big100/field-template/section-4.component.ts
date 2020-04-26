import { Component, Input, OnInit } from '@angular/core';

@Component({
 templateUrl : './section-4.component.html'
})
export class Section4Component implements OnInit {
  @Input() bigdoc: any;
  @Input ('policy') ORDER_POLICY_NAME : any;

  showSectionErrorStatus = true;

  constructor(){}
    ngOnInit(): void {
        
        let x = this.ORDER_POLICY_NAME;
    }

    handleGroupValidationStatusChange(payload) {
      if(payload.section === 'section4') {
        if(payload.isValid === 'valid') {
          this.showSectionErrorStatus = false;
        } else {
          this.showSectionErrorStatus = true;
        }
      }
    }

}