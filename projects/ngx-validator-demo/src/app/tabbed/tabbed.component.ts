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

}
