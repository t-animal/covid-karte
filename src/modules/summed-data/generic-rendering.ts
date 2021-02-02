import { RkiDiffData, RkiFeatureData } from '../data-loading';
import { format, getElementOrThrow } from '../helpers';
import { countryWideDiff, diffOfSpecificCounty } from './diff-calculation';

export async function renderDiffData(rootElem: Element,
  data: RkiFeatureData<RkiDiffData>,
  countyId: number | null
): Promise<void> {
  const leadingDiffElem = getElementOrThrow('span.daily-diff', rootElem);
  const secondaryDiffContainer = getElementOrThrow('.secondary-info.daily-diff', rootElem);
  const secondaryDiffElem = getElementOrThrow('span', secondaryDiffContainer);

  const totalDiff = countryWideDiff(data);
  if (countyId !== null) {
    const countyDiff = await diffOfSpecificCounty(countyId, data);
    leadingDiffElem.textContent = withSign(countyDiff);
    secondaryDiffElem.textContent = withSign(totalDiff);
    secondaryDiffContainer.classList.remove('no-data');
  } else {
    leadingDiffElem.textContent = withSign(totalDiff);
    secondaryDiffContainer.classList.add('no-data');
  }
}

function withSign(num: number): string {
  return (num >= 0 ? '+' : '') + format(num);
}
