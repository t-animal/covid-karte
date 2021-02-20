import { daysSince } from '../helpers';
import { getDate, selectDate, selectToday } from './date-selection';

let cancel = false;

export async function runAnimation(): Promise<void> {
  cancel = false;

  document.querySelector('body').dataset.runningAnimation = '';

  const selectedDate = getDate();
  const startDate = selectedDate === 'today' ? daysSince(2020, 9, 1) : daysSince(...selectedDate);
  for (const date of startDate) {
    if (cancel) {
      break;
    }

    selectDate(date);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (!cancel) {
    selectToday();
  }

  delete document.querySelector('body').dataset.runningAnimation;
}

export function cancelAnimation(): void {
  cancel = true;
}
