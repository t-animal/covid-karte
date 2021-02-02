import { loadCountyData } from './data-loading';
import { RkiCountyFeatureAttributes } from './data-loading/types';

type Observer = () => void;

let selectedRkiId: number | null = null;
const dataChangeObservers: Observer[] = [];

export function selectCounty(rkiCountyId: number): void {
  selectedRkiId = rkiCountyId;
  dataChangeObservers.forEach(listener => listener());
}

export function deselectCounty(): void {
  selectedRkiId = null;
  dataChangeObservers.forEach(listener => listener());
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
  dataChangeObservers.push(listener);
}

export async function getDataOfSelectedCounty()
  : Promise<{ attributes: RkiCountyFeatureAttributes } | null> {
  const rkiData = await loadCountyData();
  return rkiData.features.find(feature => feature.attributes.OBJECTID == selectedRkiId) ?? null;
}
