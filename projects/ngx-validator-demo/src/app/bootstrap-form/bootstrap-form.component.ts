import { Component, OnInit } from '@angular/core';
import { PersonValidationPolicy } from '../simple/simple.person.validation.policy';
import { NgxValidationRunnerService } from 'ngx-model-validator';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-bootstrap-form',
  templateUrl: './bootstrap-form.component.html',
  styleUrls: ['./bootstrap-form.component.css']
})
export class BootstrapFormComponent implements OnInit {

  public PERSON_POLICY_NAME = 'bs-person-validation';
  public PERSON_VALIDATION_FN = PersonValidationPolicy;

  public genderOptions = [{ 'label': 'Male', 'value': 'M' }, { 'label': 'Female', 'value': 'F' }];

  public states = [{ 'viewValue': 'California', 'value': 'CA' }, { 'viewValue': 'Michigan', 'value': 'MI' }, { 'viewValue': 'Minnesota', 'value': 'MN' }];

  public shouldShowButtonProgress = false;
  public disableValidateButton = false;

  public person = {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: ''
    }
  };

  constructor(private valRunnerSvc: NgxValidationRunnerService, private notificationSvc: NotificationsService) {
  }

  ngOnInit() {
  }

  validate() {
    this.valRunnerSvc.validate(this.PERSON_POLICY_NAME,this.person)
  }

}
