import { daysSince } from '../helpers';
import { selectDate, selectToday } from './date-selection';

let cancel = false;

export async function runAnimation(): Promise<void> {
  cancel = false;
  document.querySelector('body').dataset.runningAnimation = '';
  for (const date of daysSince(2020, 9, 1)) {
    if (cancel) {
      break;
    }

    selectDate(date);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  selectToday();

  delete document.querySelector('body').dataset.runningAnimation;
}

export function cancelAnimation(): void {
  cancel = true;
}
