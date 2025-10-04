import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvshowSeason } from './tvshow-season';

describe('TvshowSeason', () => {
  let component: TvshowSeason;
  let fixture: ComponentFixture<TvshowSeason>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvshowSeason]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvshowSeason);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
