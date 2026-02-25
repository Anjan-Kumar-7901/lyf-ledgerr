import { Category } from './category.model';

export interface HourLog {
  time: string;
  category: Category | null;
}
