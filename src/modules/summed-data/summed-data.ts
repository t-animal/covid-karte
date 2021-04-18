
import {
  getDataOfSelectedCounty, observeCountyChanges, selectedCountyRkiId
} from '../county-selection';
import {
  loadCountyData, loadTodaysCasesDiff, loadTodaysDeathsDiff, loadTodaysSummedData
} from '../data-loading';
import { loadTodaysAggregateData } from '../data-loading/index';
import { format, getElementOrThrow } from '../helpers';
import { renderDiffData } from './generic-rendering';

export function loadAndDisplaySums(): void {
  const countyId = selectedCountyRkiId();
  loadAndDisplayCountryWideCasesAndDeathSums(countyId != null);
  loadAndDisplayCountySpecificCasesAndDeathSums(countyId);
  loadAndDisplayDeathDiff(countyId);
  loadAndDisplayCasesDiff(countyId);
  loadAndDisplay7DayIncidence(countyId);
}

export async function reactToCountySelection(): Promise<void> {
  observeCountyChanges(loadAndDisplaySums);
}

async function loadAndDisplayCountryWideCasesAndDeathSums(asSecondary: boolean) {
  const data = await loadTodaysSummedData();

  const spanSelector = `${asSecondary ? '.daily-sum.secondary-info' : ''} span:first-of-type`;
  const casesElem = getElementOrThrow(`.cases-section ${spanSelector}`);
  const deathsElem = getElementOrThrow(`.deaths-section ${spanSelector}`);

  const { totalCases, totalDeaths } = data.features[0].attributes;

  casesElem.textContent = format(totalCases);
  deathsElem.textContent = format(totalDeaths);
}

async function loadAndDisplayCountySpecificCasesAndDeathSums(countyId: number | null) {
  const casesContainer = getElementOrThrow('.cases-section .daily-sum.secondary-info');
  const deathsContainer = getElementOrThrow('.deaths-section .daily-sum.secondary-info');
  if (countyId == null) {
    casesContainer.classList.add('no-data');
    deathsContainer.classList.add('no-data');
    return;
  }

  const data = await loadCountyData();
  const countyData = data.features.find((feature) => feature.attributes.OBJECTID == countyId);

  const casesElem = getElementOrThrow('.cases-section span:first-of-type');
  const deathsElem = getElementOrThrow('.deaths-section span:first-of-type');

  const { cases, deaths } = countyData?.attributes ?? {};

  casesElem.textContent = cases?.toString() ?? 'unbekannt, wahrscheinlich 0';
  deathsElem.textContent = deaths?.toString() ?? 'unbekannt, wahrscheinlich 0';

  casesContainer.classList.remove('no-data');
  deathsContainer.classList.remove('no-data');
}

async function loadAndDisplayDeathDiff(countyId: number | null) {
  const data = await loadTodaysDeathsDiff();
  const section = getElementOrThrow('.deaths-section');
  renderDiffData(section, data, countyId);
}

async function loadAndDisplayCasesDiff(countyId: number | null) {
  const data = await loadTodaysCasesDiff();
  const section = getElementOrThrow('.cases-section');
  renderDiffData(section, data, countyId);
}

async function loadAndDisplay7DayIncidence(countyId: number | null) {
  const data = await loadTodaysAggregateData();

  const section = getElementOrThrow('.seven-day-incidence-section');
  const primary = getElementOrThrow('.seven-day-incidence-section .seven-day-incidence', section);
  const secondary = getElementOrThrow('.secondary-info', section);

  if(countyId == null) {
    primary.textContent = format(data.features[0].attributes.Inz7T, 1);
    secondary.classList.add('no-data');
  } else {
    const countyData = await getDataOfSelectedCounty();
    
    primary.textContent = format(countyData?.attributes.cases7_per_100k ?? -1, 1);
    getElementOrThrow('span', secondary).textContent = format(data.features[0].attributes.Inz7T, 1);
    secondary.classList.remove('no-data');
  }

  
}
