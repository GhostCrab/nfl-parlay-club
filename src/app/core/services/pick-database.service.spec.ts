import { TestBed } from '@angular/core/testing';

import { PickDatabaseService } from './pick-database.service';

describe('PickDatabaseService', () => {
  let service: PickDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
