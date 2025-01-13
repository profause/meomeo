import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAlertDialogComponent } from './material-alert-dialog.component';

describe('MaterialAlertDialogComponent', () => {
  let component: MaterialAlertDialogComponent;
  let fixture: ComponentFixture<MaterialAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
