import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCustomerFormComponent } from './vehicle-customer-form.component';

describe('AddVehicleCustomerComponent', () => {
  let component: VehicleCustomerFormComponent;
  let fixture: ComponentFixture<VehicleCustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleCustomerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
