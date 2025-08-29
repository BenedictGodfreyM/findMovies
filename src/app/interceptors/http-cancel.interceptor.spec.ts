import { TestBed } from '@angular/core/testing';

import { HttpCancelInterceptor } from './http-cancel.interceptor';

describe('HttpCancelInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpCancelInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpCancelInterceptor = TestBed.inject(HttpCancelInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
