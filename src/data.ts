import { Lesson, Vocabulary } from './types';
import { lesson6Words } from './lesson6';
import { lesson7Words } from './lesson7';
import { lesson8Words } from './lesson8';
import { lesson9Words } from './lesson9';
import { lesson10Words } from './lesson10';
import { kanjiData } from './kanjiData';

export const lessons: Lesson[] = [
  {
    id: 'lesson-6',
    title: 'Lesson 6: Khí Hậu & Đời Sống (知って楽しむ)',
    description: 'Từ vựng về thời tiết, khí hậu và các hoạt động thích ứng trong đời sống.',
  },
  {
    id: 'lesson-7',
    title: 'Lesson 7: Mối Quan Hệ & Giao Tiếp (知って楽しむ)',
    description: 'Từ vựng về giao tiếp xã hội, cách nói chuyện và các mối quan hệ.',
  },
  {
    id: 'lesson-8',
    title: 'Lesson 8: Gói quà & Lịch sử (知って楽しむ)',
    description: 'Vocabulary for Lesson 8',
  },
  {
    id: 'lesson-9',
    title: 'Lesson 9: Khám phá & Giao tiếp (知って楽しむ & 話してみよう)',
    description: 'Vocabulary for Lesson 9',
  },
  {
    id: 'lesson-10',
    title: 'Lesson 10',
    description: 'Vocabulary for Lesson 10',
  }
];

export const vocabularyData: Vocabulary[] = [
  ...lesson6Words,
  ...lesson7Words,
  ...lesson8Words,
  ...lesson9Words,
  ...lesson10Words,
];

export { kanjiData };
