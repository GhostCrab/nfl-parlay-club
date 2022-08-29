import { TestBed } from '@angular/core/testing';

import { OddsApiService } from './odds-api.service';

describe('OddsApiService', () => {
  let service: OddsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OddsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
