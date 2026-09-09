import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentForInvoiceComponent } from './payment-for-invoice-component';

describe('PaymentForInvoiceComponent', () => {
  let component: PaymentForInvoiceComponent;
  let fixture: ComponentFixture<PaymentForInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentForInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentForInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
