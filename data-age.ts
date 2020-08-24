import { loadCountyData } from './data-loading';
import { getElementOrThrow } from './helpers';

function getDataAgeElement() {
    return getElementOrThrow<HTMLSpanElement>('.data-age span');
}

export async function loadAndDisplayDataAge() {
    const rkiData = await loadCountyData();

    const dataAges = rkiData.features.map(feature => feature.attributes.last_update);
    const uniqueDataAges = Array.from(new Set(dataAges));
    
    getDataAgeElement().textContent = uniqueDataAges.join(' ');
}