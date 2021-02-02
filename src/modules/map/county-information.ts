import { deselectCounty, getDataOfSelectedCounty, observeCountyChanges } from '../county-selection';
import { RkiCountyFeatureAttributes } from '../data-loading/types';
import { format, getElementOrThrow } from '../helpers';
import { observeDateChanges } from '../history-animation/date-selection';

export async function loadAndDisplayCountyMapOverlay(): Promise<void> {
  const county = await loadData();
  renderData(county ?? null);
}

async function loadData() {
  const { attributes: county } = await getDataOfSelectedCounty() ?? {};
  return county;
}

function renderData(county: RkiCountyFeatureAttributes | null) {
  const countyInfo = getElementOrThrow<HTMLElement>('.county-info');

  if (county == null) {
    countyInfo.classList.remove('displayed');
    return;
  }

  getElementOrThrow('h3', countyInfo).textContent =
    `${county.GEN} ${county.BEZ}`;
  getElementOrThrow('.cases-row td', countyInfo).textContent =
    format(county.cases);
  getElementOrThrow('.cases-per-100k-row td', countyInfo).textContent =
    format(county.cases_per_100k, 2);
  getElementOrThrow('.cases-per-100k-last-7d-row td', countyInfo).textContent =
    format(county.cases7_per_100k, 2);
  getElementOrThrow('.deaths-row td', countyInfo).textContent =
    format(county.deaths);
  getElementOrThrow('.inhabitants-row td', countyInfo).textContent =
    format(county.EWZ);
  getElementOrThrow('.data-age-row td', countyInfo).textContent =
    `${county.last_update}`;
  countyInfo.classList.add('displayed');

  getElementOrThrow<HTMLAnchorElement>('.permalink', countyInfo).href =
    location.href;
}

export function initCallbacks(): void {
  observeCountyChanges(loadAndDisplayCountyMapOverlay);
  observeDateChanges(loadAndDisplayCountyMapOverlay);
  getElementOrThrow<HTMLElement>('.county-info .close-icon')
    .addEventListener('click', deselectCounty);
}

