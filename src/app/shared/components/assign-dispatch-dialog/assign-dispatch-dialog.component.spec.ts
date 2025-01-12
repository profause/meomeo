import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDispatchDialogComponent } from './assign-dispatch-dialog.component';

describe('AssignDispatchDialogComponent', () => {
  let component: AssignDispatchDialogComponent;
  let fixture: ComponentFixture<AssignDispatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDispatchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDispatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
