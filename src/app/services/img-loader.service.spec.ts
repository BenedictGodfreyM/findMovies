import { TestBed } from '@angular/core/testing';

import { ImgLoaderService } from './img-loader.service';

describe('ImgLoaderService', () => {
  let service: ImgLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
