import { loadCountyData } from './data-loading';
import { getElementOrThrow } from './helpers';
import { observeDateChanges } from './history-animation/date-selection';

function getDataAgeElement() {
  return getElementOrThrow<HTMLSpanElement>('.data-age span');
}

export async function loadAndDisplayDataAge(): Promise<void> {
  const rkiData = await loadCountyData();

  const dataAges = rkiData.features.map(feature => feature.attributes.last_update);
  const uniqueDataAges = Array.from(new Set(dataAges));

  getDataAgeElement().textContent = uniqueDataAges.join(' ');
}

export function initCallbacks(): void {
  observeDateChanges(loadAndDisplayDataAge);
}
