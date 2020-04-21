import { Component, OnInit } from '@angular/core';
import { NgxValidationRunnerService } from 'ngx-model-validator';
import { Big100ValidationPolicy } from './big100.validation.policy';

@Component({
  selector: 'app-big100',
  templateUrl: './big100.component.html',
  styleUrls: ['./big100.component.css']
})
export class Big100Component implements OnInit {

  public ORDER_POLICY_NAME = 'big100-validation-policy';
  public ORDER_VALIDATION_FN = Big100ValidationPolicy;

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

  constructor(private valRunnerSvc: NgxValidationRunnerService) { }

  validate() {

    this.valRunnerSvc.validate(this.ORDER_POLICY_NAME, this.bigdoc).subscribe(result => {
      if (result && result.length > 0) {
        console.error('Validation error found');
      }
    });

  }

  ngOnInit() {
  }

}
