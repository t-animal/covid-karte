import { loadCountyData } from './data-loading';
import { RkiCountyFeatureAttributes } from './data-loading/types';
import { Observable, Observer } from './observers';

let selectedRkiId: number | null = null;
const countyChangeObservable = new Observable();

export function selectCounty(rkiCountyId: number): void {
  selectedRkiId = rkiCountyId;
  countyChangeObservable.notify();
}

export function deselectCounty(): void {
  selectedRkiId = null;
  countyChangeObservable.notify();
}

export function selectOrToggleCounty(rkiCountyId: number): void {
  if (selectedRkiId == rkiCountyId) {
    return deselectCounty();
  }
  selectCounty(rkiCountyId);
}

export function selectedCountyRkiId(): number | null {
  return selectedRkiId;
}

export function observeCountyChanges(listener: Observer): void {
  countyChangeObservable.observe(listener);
}

export async function getDataOfSelectedCounty()
  : Promise<{ attributes: RkiCountyFeatureAttributes } | null> {
  const rkiData = await loadCountyData();
  return rkiData.features.find(feature => feature.attributes.OBJECTID == selectedRkiId) ?? null;
}
