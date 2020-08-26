import { loadTodaysSummedData, loadTodaysCasesDiff, loadTodaysDeathsDiff } from './data-loading';
import { getElementOrThrow } from './helpers';

export async function loadAndDisplaySums() {
    loadAndDisplayCasesAndDeathSums();
    loadAndDisplayDeathDiff();
    loadAndDisplayCasesDiff();
}


async function loadAndDisplayCasesAndDeathSums() {
    const data = await loadTodaysSummedData();

    const casesElem = getElementOrThrow('.cases-section span:first-of-type');
    const deathsElem = getElementOrThrow('.deaths-section span:first-of-type');

    const {totalCases, totalDeaths} = data.features[0].attributes;

    casesElem.textContent = totalCases.toString();
    deathsElem.textContent = totalDeaths.toString();
}

async function loadAndDisplayDeathDiff() {
    const data = await loadTodaysDeathsDiff();
    const deathsDiffElem = getElementOrThrow('.deaths-section span:nth-of-type(2)');

    const diff = data.features[0].attributes.diff;
    deathsDiffElem.textContent = (diff >= 0 ? '+' : '-') + diff;
}

async function loadAndDisplayCasesDiff() {
    const data = await loadTodaysCasesDiff();
    const casesDiffElem = getElementOrThrow('.cases-section span:nth-of-type(2)');

    const diff = data.features[0].attributes.diff;
    casesDiffElem.textContent = (diff >= 0 ? '+' : '-') + diff;
}