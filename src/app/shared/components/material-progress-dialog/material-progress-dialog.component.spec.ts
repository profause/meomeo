import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialProgressDialogComponent } from './material-progress-dialog.component';

describe('MaterialProgressDialogComponent', () => {
  let component: MaterialProgressDialogComponent;
  let fixture: ComponentFixture<MaterialProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialProgressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
