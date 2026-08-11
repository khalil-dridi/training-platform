import { ChapterResponse } from '../../../../trainer/pages/models/chapter-response.model';
import { LessonResponse } from '../../../../trainer/pages/models/lesson-response.model';

export interface ChapterWithLessons {
  chapter: ChapterResponse;
  lessons: LessonResponse[];
}
