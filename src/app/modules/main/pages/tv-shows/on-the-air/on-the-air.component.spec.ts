import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnTheAirComponent } from './on-the-air.component';

describe('OnTheAirComponent', () => {
  let component: OnTheAirComponent;
  let fixture: ComponentFixture<OnTheAirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnTheAirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnTheAirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
