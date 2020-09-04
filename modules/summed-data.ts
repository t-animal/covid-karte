
import { observeCountyChanges, selectedCountyRkiId } from './county-selection';
import {
  loadCountyData, loadTodaysCasesDiff, loadTodaysDeathsDiff, loadTodaysSummedData, RkiDiffData,
  RkiFeatureData
} from './data-loading';
import { countyNameById, getElementOrThrow } from './helpers';

export async function loadAndDisplaySums(countyId: number | null = null): Promise<void> {
  loadAndDisplayCountryWideCasesAndDeathSums(countyId != null);
  loadAndDisplayCountySpecificCasesAndDeathSums(countyId);
  loadAndDisplayDeathDiff(countyId);
  loadAndDisplayCasesDiff(countyId);
}

export async function reactToCountySelection(): Promise<void> {
  observeCountyChanges(() => {
    const countyId = selectedCountyRkiId();
    loadAndDisplaySums(countyId);
  });
}


async function loadAndDisplayCountryWideCasesAndDeathSums(asSecondary: boolean) {
  const data = await loadTodaysSummedData();

  const spanSelector = `${asSecondary ? '.daily-sum.secondary-info' : ''} span:first-of-type`;
  const casesElem = getElementOrThrow(`.cases-section ${spanSelector}`);
  const deathsElem = getElementOrThrow(`.deaths-section ${spanSelector}`);

  const { totalCases, totalDeaths } = data.features[0].attributes;

  casesElem.textContent = totalCases.toString();
  deathsElem.textContent = totalDeaths.toString();
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

async function renderDiffData(rootElem: Element,
  data: RkiFeatureData<RkiDiffData>,
  countyId: number | null
) {
  const leadingDiffElem = getElementOrThrow('span.daily-diff', rootElem);
  const secondaryDiffContainer = getElementOrThrow('.secondary-info.daily-diff', rootElem);
  const secondaryDiffElem = getElementOrThrow('span', secondaryDiffContainer);

  const totalDiff = countryWideDiff(data);
  if (countyId !== null) {
    const countyDiff = await diffOfSpecificCounty(countyId, data);
    leadingDiffElem.textContent = withSign(countyDiff);
    secondaryDiffElem.textContent = withSign(totalDiff);
    secondaryDiffContainer.classList.remove('no-data');
  } else {
    leadingDiffElem.textContent = withSign(totalDiff);
    secondaryDiffContainer.classList.add('no-data');
  }
}


function countryWideDiff(data: RkiFeatureData<RkiDiffData>) {
  return data.features.reduce((prev, curr) => prev + curr.attributes.diff, 0);
}

async function diffOfSpecificCounty(countyId: number, data: RkiFeatureData<RkiDiffData>) {
  const countyName = await countyNameById(countyId);
  return data.features
    .find(feature => feature.attributes.Landkreis == countyName)
    ?.attributes.diff ?? 0;
}

function withSign(num: number) {
  return (num >= 0 ? '+' : '-') + num;
}