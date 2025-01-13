import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAlertToasterComponent } from './material-alert-toaster.component';

describe('MaterialAlertToasterComponent', () => {
  let component: MaterialAlertToasterComponent;
  let fixture: ComponentFixture<MaterialAlertToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAlertToasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAlertToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
