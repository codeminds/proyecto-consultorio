import { TestBed } from '@angular/core/testing';

import { FieldApi } from './field.api';

describe('FieldApi', () => {
  let service: FieldApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
