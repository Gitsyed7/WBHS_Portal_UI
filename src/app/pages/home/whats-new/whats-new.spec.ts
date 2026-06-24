import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsNew } from './whats-new';

describe('WhatsNew', () => {
  let component: WhatsNew;
  let fixture: ComponentFixture<WhatsNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsNew],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
