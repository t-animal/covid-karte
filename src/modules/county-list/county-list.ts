import { selectOrToggleCounty } from '../county-selection';
import { loadCountyData } from '../data-loading';
import { RkiCountyFeatureAttributes } from '../data-loading/types';
import { format, getElementOrThrow } from '../helpers';
import { getSortFunction } from './sorting';

function getTableElement() {
  return getElementOrThrow<HTMLTableElement>('.county-list');
}

export async function loadAndDisplayCountyList(): Promise<void> {
  const counties = await loadCountyData();
  const sortedCounties = [...counties.features].map(elem => elem.attributes);
  sortedCounties.sort(getSortFunction());

  const tableElement = getTableElement();
  tableElement.querySelectorAll('tr:not(.sort-row)').forEach(elem => elem.remove());
  for (const county of sortedCounties) {
    const newEntry = createRow(county);
    tableElement.appendChild(newEntry);
  }
}

function createRow(county: RkiCountyFeatureAttributes) {
  const rowElem = document.createElement('tr');
  rowElem.appendChild(createCell('td', 'cases-7d-100k', format(county.cases7_per_100k, 1)));
  rowElem.appendChild(createCell('td', 'cases', format(county.cases)));
  rowElem.appendChild(createCell('td', 'deaths', format(county.deaths)));
  rowElem.appendChild(createCell('th', 'county-name', `${county.GEN} ${county.BEZ}`));

  rowElem.addEventListener('click', () => selectOrToggleCounty(county.OBJECTID));

  return rowElem;
}

function createCell(type: 'td' | 'th', cssClass: string, content: string | number) {
  const elem = document.createElement(type);
  elem.classList.add(cssClass);
  elem.textContent = content.toString();
  return elem;
}