import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsAndQrComponent } from './labels-and-qr.component';

describe('LabelsAndQrComponent', () => {
  let component: LabelsAndQrComponent;
  let fixture: ComponentFixture<LabelsAndQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsAndQrComponent]
    });
    fixture = TestBed.createComponent(LabelsAndQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
