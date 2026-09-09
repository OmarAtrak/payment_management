import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsExpenseComponent } from './details-expense.component';

describe('DetailsExpenseComponent', () => {
  let component: DetailsExpenseComponent;
  let fixture: ComponentFixture<DetailsExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
