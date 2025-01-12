import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemDetailDialogComponent } from './order-item-detail-dialog.component';

describe('OrderItemDetailDialogComponent', () => {
  let component: OrderItemDetailDialogComponent;
  let fixture: ComponentFixture<OrderItemDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderItemDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
