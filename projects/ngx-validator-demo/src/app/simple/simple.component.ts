import { Component, OnInit } from '@angular/core';
import { PersonValidationPolicy } from './simple.person.validation.policy';
import { NgxValidationRunnerService } from 'ngx-model-validator';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleComponent implements OnInit {

  public PERSON_POLICY_NAME = 'simple-person-validation';
  public PERSON_VALIDATION_FN = PersonValidationPolicy;
  title = 'ngx-validator-demo';

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

  validate() {
    this.disableValidateButton = true;
    this.shouldShowButtonProgress = true;


    this.valRunnerSvc.validate(this.PERSON_POLICY_NAME, this.person).subscribe(result => {
      if (result && result.length > 0) {
        console.error('Validation error found');
        const notification = {
          title: 'Validation Error',
          content: 'Please fix errors on this form',
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          animate: 'scale'
        };
        const title = notification.title;
        const content = notification.content;
        const type = NotificationType.Error;
        this.notificationSvc.create(title, content, type, notification);
      } else {
        const notification = {
          title: 'Validation Success',
          content: 'Successfully validated the form.',
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          animate: 'scale'
        };
        const title = notification.title;
        const content = notification.content;
        const type = NotificationType.Success;
        this.notificationSvc.create(title, content, type, notification);

      }

      this.disableValidateButton = false;
      this.shouldShowButtonProgress = false;
    });

  }

  ngOnInit() {
  }

}
