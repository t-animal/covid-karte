import {
  loadHistoricCountyData, RkiCountyFeatureAttributes, RkiFeatureData
} from '../data-loading';
import { daysSince } from '../helpers';
import { addCountiesToMap, highlightSelectedCounty } from '../map/map';
import { loadCountyMap } from '../map/map-helpers';

export function addDev() {
  (window as any).loadAndDisplayHistoric = async (): Promise<void> => {
    for (const [year, month, day] of daysSince(2020, 9, 1)) {
      const rkiData: RkiFeatureData<RkiCountyFeatureAttributes> =
        await loadHistoricCountyData(year, month, day);
      const countiesGeoJson = await loadCountyMap();

      addCountiesToMap(rkiData, countiesGeoJson);

      highlightSelectedCounty(rkiData, countiesGeoJson);

      await new Promise(resolve => setTimeout(resolve, 0));
    }
  };
}
