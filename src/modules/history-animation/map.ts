import * as animation from './animation';
import { selectDate, selectToday } from './date-selection';

export function addDev() {
  (window as any).dev = {
    animation,
    selectDate,
    selectToday
  };
}
