import { TestBed } from '@angular/core/testing';

import { AppointmentApi } from './appointment.api';

describe('AppointmentApi', () => {
  let service: AppointmentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
