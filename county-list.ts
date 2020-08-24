import { loadRkiData, RkiCountyFeatureAttributes } from './data-loading';

function getTableElement(): HTMLTableElement {
    const elem = document.querySelector<HTMLTableElement>('.county-list');
    if(elem === null) {
        throw Error('Could not find county-list element');
    }
    return elem;
}

export async function loadAndDisplayCountyList() {
    const counties = await loadRkiData();
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
    return rowElem;
}

function createCell(type: 'td'|'th', cssClass: string, content: string | number) {
    const elem = document.createElement(type);
    elem.classList.add(cssClass);
    elem.textContent = content.toString();
    return elem;
}