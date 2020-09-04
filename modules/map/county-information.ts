import { deselectCounty, getDataOfSelectedCounty, observeCountyChanges } from '../county-selection';
import { getElementOrThrow } from '../helpers';

async function renderSelectedCounty() {
  const { attributes: county } = await getDataOfSelectedCounty() ?? {};
  const countyInfo = getElementOrThrow<HTMLElement>('.county-info');

  if (county == null) {
    countyInfo.classList.remove('displayed');
    return;
  }

  const population = county.cases / county.cases_per_population * 100;

  getElementOrThrow('h3', countyInfo).textContent = 
    `${county.GEN} ${county.BEZ}`;
  getElementOrThrow('.cases-row td', countyInfo).textContent = 
    `${county.cases}`;
  getElementOrThrow('.cases-per-100k-row td', countyInfo).textContent =
    `${county.cases_per_100k.toFixed(2)}`;
  getElementOrThrow('.cases-per-100k-last-7d-row td', countyInfo).textContent = 
    `${county.cases7_per_100k.toFixed(2)}`;
  getElementOrThrow('.deaths-row td', countyInfo).textContent = 
    `${county.deaths}`;
  getElementOrThrow('.inhabitants-row td', countyInfo).textContent = 
    `etwa ${population.toFixed(0)}`;
  getElementOrThrow('.data-age-row td', countyInfo).textContent = 
    `${county.last_update}`;
  countyInfo.classList.add('displayed');
}

export function initCallbacks(): void {
  observeCountyChanges(renderSelectedCounty);
  getElementOrThrow<HTMLElement>('.county-info .close-icon')
    .addEventListener('click', deselectCounty);
}