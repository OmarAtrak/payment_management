import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductForInvoiceComponent } from './product-for-invoice.component';

describe('AddProductForInvoiceComponent', () => {
  let component: ProductForInvoiceComponent;
  let fixture: ComponentFixture<ProductForInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductForInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductForInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
