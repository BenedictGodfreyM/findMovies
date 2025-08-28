import { TestBed } from '@angular/core/testing';

import { UiLoaderService } from './ui-loader.service';

describe('UiLoaderService', () => {
  let service: UiLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
