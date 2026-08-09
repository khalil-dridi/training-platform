import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorRequests } from './instructor-requests';

describe('InstructorRequests', () => {
  let component: InstructorRequests;
  let fixture: ComponentFixture<InstructorRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
