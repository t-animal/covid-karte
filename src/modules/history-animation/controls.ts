import { daysSince, getElementOrThrow } from '../helpers';
import { cancelAnimation, runAnimation } from './animation';
import {
  getDate,

  observeDateChanges,
  selectDate,
  selectToday,
  yyyymmdd
} from './date-selection';

const valueByDay: { [value: number]: yyyymmdd } = {};
const daysByValue: yyyymmdd[] = [...daysSince(2020, 9, 1)];

function setupRange() {
  let daysPassed = 0;

  for (const day of daysByValue) {
    valueByDay[day.toString()] = daysPassed++;
  }

  const slider = getSlider();
  slider.max = '' + daysPassed;
  slider.value = '' + daysPassed;

  observeDateChanges(() => {
    if (getDate() == 'today') {
      slider.value = slider.max;
      delete document.querySelector('body').dataset.historicData;
    } else {
      slider.value = valueByDay[getDate().toString()];
      document.querySelector('body').dataset.historicData = '';
    }
  });
}

function selectOffset(offset: number) {
  const newValue = getValue() + offset;
  if (newValue < 0) {
    selectDate(daysByValue[0]);
    return;
  }

  if (newValue >= daysByValue.length) {
    selectToday();
    return;
  }

  selectDate(daysByValue[newValue]);

}

function getSlider() {
  return getElementOrThrow<HTMLInputElement>('.animation-control-range');
}

function getValue() {
  return parseInt(getSlider().value);
}

export function initCallbacks(): void {
  setupRange();
  getElementOrThrow('.animation-control-start').addEventListener('click', runAnimation);
  getElementOrThrow('.animation-control-stop').addEventListener('click', cancelAnimation);

  getElementOrThrow('.animation-control-next').addEventListener('click', () => selectOffset(+1));
  getElementOrThrow('.animation-control-prev').addEventListener('click', () => selectOffset(-1));
  getElementOrThrow('.animation-control-today').addEventListener('click', () => selectToday());
  getElementOrThrow('.animation-control-last-week')
    .addEventListener('click', () => selectOffset(-7));
  getElementOrThrow('.animation-control-next-week')
    .addEventListener('click', () => selectOffset(+7));
}
