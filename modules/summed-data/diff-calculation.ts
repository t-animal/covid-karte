import { RkiDiffData, RkiFeatureData } from '../data-loading';
import { countyNameById } from '../helpers';

export function countryWideDiff(data: RkiFeatureData<RkiDiffData>): number {
  return data.features.reduce((prev, curr) => prev + curr.attributes.diff, 0);
}

export async function diffOfSpecificCounty(
  countyId: number,
  data: RkiFeatureData<RkiDiffData>
): Promise<number> {
  const countyName = await countyNameById(countyId);
  return data.features
    .find(feature => feature.attributes.Landkreis == countyName)
    ?.attributes.diff ?? 0;
}
