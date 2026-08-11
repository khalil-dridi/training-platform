import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLesson } from './create-lesson';

describe('CreateLesson', () => {
  let component: CreateLesson;
  let fixture: ComponentFixture<CreateLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
