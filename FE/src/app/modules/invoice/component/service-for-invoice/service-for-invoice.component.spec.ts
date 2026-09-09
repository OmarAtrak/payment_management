import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceForInvoiceComponent } from './service-for-invoice.component';

describe('AddServiceForInvoiceComponent', () => {
  let component: ServiceForInvoiceComponent;
  let fixture: ComponentFixture<ServiceForInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceForInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceForInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
