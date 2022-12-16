import { TestBed } from '@angular/core/testing';

import { GenderApi } from './gender.api';

describe('GenderService', () => {
  let service: GenderApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenderApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
