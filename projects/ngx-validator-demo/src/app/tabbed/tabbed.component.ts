import { Component, OnInit } from '@angular/core';
import { NgxValidationRunnerService } from 'ngx-model-validator';
import { OrderValidationPolicy } from './tabbed.order.validation.policy';

@Component({
  selector: 'app-tabbed',
  templateUrl: './tabbed.component.html',
  styleUrls: ['./tabbed.component.css']
})
export class TabbedComponent implements OnInit {

  public ORDER_POLICY_NAME = 'tabbed-order-policy';
  public ORDER_VALIDATION_FN = OrderValidationPolicy;
  public states = [{ 'viewValue': 'California', 'value': 'CA' }, { 'viewValue': 'Michigan', 'value': 'MI' }, { 'viewValue': 'Minnesota', 'value': 'MN' }];

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

  public flags = {
    showPersonalSectionErrorStatus : true,
    showAddressSectionErrorStatus : true,
    showPaymentSectionErrorStatus : true,
  }

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
    if(payload.section === 'personal-section') {
      if(payload.isValid === 'valid') {
        this.flags.showPersonalSectionErrorStatus = false;
      } else {
        this.flags.showPersonalSectionErrorStatus = true;
      }
    } else if(payload.section === 'address-section') {
      if(payload.isValid === 'valid') {
        this.flags.showAddressSectionErrorStatus = false;
      } else {
        this.flags.showAddressSectionErrorStatus = true;
      }
    } else if(payload.section === 'payment-section') {
      if(payload.isValid === 'valid') {
        this.flags.showPaymentSectionErrorStatus = false;
      } else {
        this.flags.showPaymentSectionErrorStatus = true;
      }
    }
  }

}
