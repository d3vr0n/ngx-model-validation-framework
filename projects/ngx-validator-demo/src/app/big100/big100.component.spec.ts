import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Big100Component } from './big100.component';

describe('Big100Component', () => {
  let component: Big100Component;
  let fixture: ComponentFixture<Big100Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Big100Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Big100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
