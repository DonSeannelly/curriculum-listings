import { TestBed } from '@angular/core/testing';

import { SystemOutagesService } from './system-outages.service';

describe('SystemOutagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemOutagesService = TestBed.inject(SystemOutagesService);
    expect(service).toBeTruthy();
  });
});
