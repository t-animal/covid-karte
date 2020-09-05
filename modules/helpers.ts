import { loadCountyData } from './data-loading';

export function getElementOrThrow<E extends Element = Element>(
  selector: string, baseElement?: Element
): E {
  const elem = (baseElement ?? document).querySelector<E>(selector);
  if (elem === null) {
    throw Error(
      `Could not find element "${selector}" on "${baseElement?.localName ?? 'document'}"`
    );
  }
  return elem;
}

export async function countyNameById(countyId: number): Promise<string | null> {
  const data = await loadCountyData();
  return data.features
    .find((feature) => feature.attributes.OBJECTID == countyId)
    ?.attributes.county ?? null;
}


const formatters: {[decimalDigits: number]: Intl.NumberFormat} = {};
export function format(num: number, decimalDigits = 0): string {
  return (formatters[decimalDigits] ?? makeFormatter(decimalDigits)).format(num);
}

function makeFormatter(decimalDigits: number) {
  formatters[decimalDigits] = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: decimalDigits
  });

  return formatters[decimalDigits];
}