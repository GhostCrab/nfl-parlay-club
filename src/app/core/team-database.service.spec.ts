import { TestBed } from '@angular/core/testing';

import { TeamDatabaseService } from './team-database.service';

describe('TeamDatabaseService', () => {
  let service: TeamDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
