import { NgModule } from '@angular/core';

import { NgxMatValidatorDirective } from "./ngx-material-validator.directive";
import { NgxComponentValidatorDirective } from "./ngx-component-validator.directive";
import { NgxValidationRunnerService } from './service/ngx-validation-runner.service';
import { NgxMatRequiredDirective } from './ngx-material-required.directive';
import { NgxBootStrapValidatorDirective } from './ngx-bootstrap-validator.directive';

@NgModule({
  exports: [NgxMatValidatorDirective, NgxComponentValidatorDirective, NgxMatRequiredDirective, NgxBootStrapValidatorDirective],
  declarations: [NgxMatValidatorDirective, NgxComponentValidatorDirective, NgxMatRequiredDirective, NgxBootStrapValidatorDirective],
  providers: [NgxValidationRunnerService]
})

export class NgxValidationModule { }
