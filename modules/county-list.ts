import { loadCountyData, RkiCountyFeatureAttributes } from './data-loading';
import { getElementOrThrow } from './helpers';
import { selectOrToggleCounty } from './county-selection';

function getTableElement() {
    return getElementOrThrow<HTMLTableElement>('.county-list');
}

export async function loadAndDisplayCountyList() {
    const counties = await loadCountyData();
    const sortedCounties = [...counties.features].map(elem => elem.attributes);
    sortedCounties.sort((a,b) => b.cases - a.cases)

    const tableElement = getTableElement();
    for(const county of sortedCounties) {
        const newEntry = createRow(county);
        tableElement.appendChild(newEntry);
    }
}

function createRow(county: RkiCountyFeatureAttributes) {
    const rowElem = document.createElement('tr');
    rowElem.appendChild(createCell('td', 'cases', county.cases));
    rowElem.appendChild(createCell('td', 'deaths', county.deaths));
    rowElem.appendChild(createCell('th', 'county-name', `${county.GEN} ${county.BEZ}`));

    rowElem.addEventListener('click', () => selectOrToggleCounty(county.OBJECTID));

    return rowElem;
}

function createCell(type: 'td'|'th', cssClass: string, content: string | number) {
    const elem = document.createElement(type);
    elem.classList.add(cssClass);
    elem.textContent = content.toString();
    return elem;
}