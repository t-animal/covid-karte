import { loadCountyData } from "./data-loading";

type Observer = () => void;

let selectedRkiId: number | null = null;
const dataChangeObservers: Observer[] = [];

export function selectCounty(rkiCountyId: number) {
    selectedRkiId = rkiCountyId;
    dataChangeObservers.forEach(listener => listener());
}

export function deselectCounty() {
    selectedRkiId = null;
    dataChangeObservers.forEach(listener => listener());
}

export function selectOrToggleCounty(rkiCountyId: number) {
    if(selectedRkiId == rkiCountyId) {
        return deselectCounty();
    }
    selectCounty(rkiCountyId);
}

export function selectedCountyRkiId() {
    return selectedRkiId;
}

export function observeCountyChanges(listener: Observer) {
    dataChangeObservers.push(listener);
}

export async function getDataOfSelectedCounty() {
    const rkiData = await loadCountyData();
    return rkiData.features.find(feature => feature.attributes.OBJECTID == selectedRkiId) ?? null;
}
