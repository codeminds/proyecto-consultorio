import { TestBed } from '@angular/core/testing';

import { RoleApi } from './role.api';

describe('RoleApi', () => {
  let service: RoleApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
