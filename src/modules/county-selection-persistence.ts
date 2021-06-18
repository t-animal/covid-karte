import { observeCountyChanges, selectCounty, selectedCountyRkiId } from './county-selection';

export function reactToCountySelection(): void {
  observeCountyChanges(() => {
    const countyId = selectedCountyRkiId();
    location.hash = countyId?.toString() ?? '-';
  });
}

export function restoreCountySelectionFromUrl(): void {
  if(location.hash === '' || location.hash.match(/^#[0-9]+/) === null) {
    return;
  }

  const countyId = parseInt(location.hash.substr(1));
  selectCounty(countyId);
}