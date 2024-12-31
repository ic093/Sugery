import { TestBed } from '@angular/core/testing';

import { OPService } from './op.service';

describe('OPService', () => {
  let service: OPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
