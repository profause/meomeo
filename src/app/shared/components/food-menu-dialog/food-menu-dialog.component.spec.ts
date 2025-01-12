import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodMenuDialogComponent } from './food-menu-dialog.component';

describe('FoodMenuDialogComponent', () => {
  let component: FoodMenuDialogComponent;
  let fixture: ComponentFixture<FoodMenuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodMenuDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodMenuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
