import { loadHistoricCountyData } from '../data-loading';
import { daysSince, getElementOrThrow } from '../helpers';
import { getAnimationDate, selectAnimationDate, selectToday, today } from './date-selection';

let cancel = false;
let precached = false;

export async function runAnimation(): Promise<void> {
  cancel = false;

  await cacheForAnimation();

  getElementOrThrow<HTMLBodyElement>('body').dataset.runningAnimation = '';
  const speedOption = getElementOrThrow<HTMLOptionElement>('.animation-speed option:checked');
  const speed = parseInt(speedOption.value);

  const selectedDate = getAnimationDate();
  const startDate = selectedDate === today ? daysSince(2020, 9, 1) : daysSince(...selectedDate);
  for (const date of startDate) {
    if (cancel) {
      break;
    }

    selectAnimationDate(date);
    await new Promise(resolve => setTimeout(resolve, speed));
  }

  if (!cancel) {
    selectToday();
  }

  delete getElementOrThrow<HTMLBodyElement>('body').dataset.runningAnimation;
}

async function cacheForAnimation() {
  if (precached) {
    return;
  }
  const loadingPromises = [...daysSince(2020, 9, 1)].map((date) => loadHistoricCountyData(...date));

  await showCachingHint(loadingPromises);
  precached = true;
}

async function showCachingHint(promises: Promise<any>[]) {

  const elem = getElementOrThrow('.animation-caching-hint');

  elem.parentElement.classList.add('precaching');

  let promisesDone = 0;
  for (const promise of promises) {

    elem.textContent = `Bitte warten. Vorausladen von ${promisesDone} von
        ${promises.length} Tagesdatensätzen fertig.`;

    await promise;
    promisesDone++;
  }

  elem.parentElement.classList.remove('precaching');
}

export function cancelAnimation(): void {
  cancel = true;
}
