import { daysSince, getElementOrThrow } from '../helpers';
import { cancelAnimation, runAnimation } from './animation';
import {
  getAnimationDate,

  observeDateChanges,
  selectAnimationDate,
  selectToday,
  yyyymmdd
} from './date-selection';

const valueByDay: { [value: string]: number } = {};
const daysByValue: yyyymmdd[] = [...daysSince(2020, 9, 1)];

function setupDisplay() {
  let daysPassed = 0;

  for (const day of daysByValue) {
    valueByDay[day.toString()] = daysPassed++;
  }
  valueByDay['today'] = daysPassed;

  const slider = getSlider();

  observeDateChanges(() => {
    const currentDate = getAnimationDate();
    const daysPassed = valueByDay[currentDate.toString()];
    slider.style.width = `${daysPassed / daysByValue.length * 100}%`;

    if (currentDate == 'today') {
      getElementOrThrow('.animation-control-text').innerHTML = 'Heute';
      delete document.querySelector('body').dataset.historicData;
    } else {
      const dateAsString = [...currentDate]
        .reverse()
        .map(num => num.toString().padStart(2, '0'))
        .join('.');
      getElementOrThrow('.animation-control-text').innerHTML = dateAsString;
      document.querySelector('body').dataset.historicData = '';
    }
  });
}

function selectOffset(offset: number) {
  const newValue = getValue() + offset;
  if (newValue < 0) {
    selectAnimationDate(daysByValue[0]);
    return;
  }

  if (newValue >= daysByValue.length) {
    selectToday();
    return;
  }

  selectAnimationDate(daysByValue[newValue]);

}

function getSlider() {
  return getElementOrThrow<HTMLInputElement>('.animation-control-range');
}

function getValue() {
  const date = getAnimationDate().toString();
  return valueByDay[date];
}

export function initCallbacks(): void {
  setupDisplay();
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
