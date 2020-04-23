import { Component, OnInit } from '@angular/core';
import { OrderValidationPolicy } from '../tabbed/tabbed.order.validation.policy';
import { NgxValidationRunnerService } from 'ngx-model-validator';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public ORDER_POLICY_NAME = 'group-order-policy';
  public ORDER_VALIDATION_FN = OrderValidationPolicy;
  public states = [{ 'viewValue': 'California', 'value': 'CA' }, { 'viewValue': 'Michigan', 'value': 'MI' }, { 'viewValue': 'Minnesota', 'value': 'MN' }];
  public flags = {
    showPersonalSectionErrorStatus : false
  }

  public tabdoc = {
    person : {
      firstName: '',
      lastName: '',
      email: '',
    },
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: ''
    },
    payment: {
      cardno:'',
      name:'',
      expiry:'',
      cvv:''
    }
  };

  constructor(private valRunnerSvc: NgxValidationRunnerService) { }

  validate() {

    this.valRunnerSvc.validate(this.ORDER_POLICY_NAME, this.tabdoc).subscribe(result => {
      if (result && result.length > 0) {
        console.error('Validation error found');
      }
    });

  }

  ngOnInit() {
  }

  handleGroupValidationStatusChange(payload) {
    if(payload.section === 'section') {
      if(payload.isValid === 'valid') {
        this.flags.showPersonalSectionErrorStatus = false;
      } else {
        this.flags.showPersonalSectionErrorStatus = true;
      }
    }
  }
}
