import { TestBed } from '@angular/core/testing';

import { SessionApi } from './session.api';

describe('SessionApi', () => {
  let service: SessionApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
