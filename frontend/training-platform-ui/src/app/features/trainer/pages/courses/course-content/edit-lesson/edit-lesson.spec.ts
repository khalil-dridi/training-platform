import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLesson } from './edit-lesson';

describe('EditLesson', () => {
  let component: EditLesson;
  let fixture: ComponentFixture<EditLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
