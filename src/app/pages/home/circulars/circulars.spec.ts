import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Circulars } from './circulars';

describe('Circulars', () => {
  let component: Circulars;
  let fixture: ComponentFixture<Circulars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Circulars],
    }).compileComponents();

    fixture = TestBed.createComponent(Circulars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
