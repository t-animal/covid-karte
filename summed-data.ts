import { loadTodaysSummedData } from './data-loading';
import { getElementOrThrow } from './helpers';

export async function loadAndDisplaySums() {
    const data = await loadTodaysSummedData();

    const casesElem = getElementOrThrow('.cases-section span');
    const deathsElem = getElementOrThrow('.deaths-section span');

    const {totalCases, totalDeaths} = data.features[0].attributes;

    casesElem.textContent = totalCases.toString();
    deathsElem.textContent = totalDeaths.toString();
}