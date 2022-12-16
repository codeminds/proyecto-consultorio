import { TestBed } from '@angular/core/testing';

import { DoctorApi } from './doctor.api';

describe('DoctorApi', () => {
  let service: DoctorApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
