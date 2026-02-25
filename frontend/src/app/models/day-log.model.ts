import { HourLog } from './hour-log.model';

export interface DayLog {
  date: string;
  hours: HourLog[];
}
