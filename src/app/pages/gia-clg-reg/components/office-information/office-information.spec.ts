import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeInformation } from './office-information';

describe('OfficeInformation', () => {
  let component: OfficeInformation;
  let fixture: ComponentFixture<OfficeInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficeInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
