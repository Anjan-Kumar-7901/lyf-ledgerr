import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearWrapped } from './year-wrapped';

describe('YearWrapped', () => {
  let component: YearWrapped;
  let fixture: ComponentFixture<YearWrapped>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearWrapped]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearWrapped);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
