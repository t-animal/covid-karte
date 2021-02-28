import { loadHistoricCountyData } from '../data-loading';
import { daysSince, getElementOrThrow } from '../helpers';
import { getAnimationDate, selectAnimationDate, selectToday } from './date-selection';

let cancel = false;
let precached = false;

export async function runAnimation(): Promise<void> {
  cancel = false;

  await cacheForAnimation();

  document.querySelector('body').dataset.runningAnimation = '';

  const selectedDate = getAnimationDate();
  const startDate = selectedDate === 'today' ? daysSince(2020, 9, 1) : daysSince(...selectedDate);
  for (const date of startDate) {
    if (cancel) {
      break;
    }

    selectAnimationDate(date);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (!cancel) {
    selectToday();
  }

  delete document.querySelector('body').dataset.runningAnimation;
}

async function cacheForAnimation() {
  const loadingPromises = [...daysSince(2020, 9, 1)].map((date) => loadHistoricCountyData(...date));

  await showCachingHint(loadingPromises);
}

async function showCachingHint(promises: Promise<any>[]) {
  if (precached) {
    return;
  }

  const elem = getElementOrThrow('.animation-caching-hint');

  elem.parentElement.classList.add('precaching');

  let promisesDone = 0;
  for (const promise of promises) {

    elem.textContent = `Bitte warten. Vorausladen von ${promisesDone} von
        ${promises.length} Tagesdatensätzen fertig.`;

    await promise;
    promisesDone++;
  }

  precached = true;
  elem.parentElement.classList.remove('precaching');
}

export function cancelAnimation(): void {
  cancel = true;
}
