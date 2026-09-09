import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFileComponent } from './invoice-file.component';

describe('InvoiceFileComponent', () => {
  let component: InvoiceFileComponent;
  let fixture: ComponentFixture<InvoiceFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
