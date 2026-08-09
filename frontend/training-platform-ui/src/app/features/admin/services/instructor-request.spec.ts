import { TestBed } from '@angular/core/testing';

import { InstructorRequest } from './instructor-request';

describe('InstructorRequest', () => {
  let service: InstructorRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
