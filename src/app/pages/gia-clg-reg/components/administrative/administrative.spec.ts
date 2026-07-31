import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Administrative } from './administrative';

describe('Administrative', () => {
  let component: Administrative;
  let fixture: ComponentFixture<Administrative>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Administrative],
    }).compileComponents();

    fixture = TestBed.createComponent(Administrative);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
