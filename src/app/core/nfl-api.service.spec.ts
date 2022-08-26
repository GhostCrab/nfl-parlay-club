import { TestBed } from '@angular/core/testing';

import { NFLApiService } from './nfl-api.service';

describe('NFLApiService', () => {
  let service: NFLApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NFLApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
