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


const formatters: { [decimalDigits: number]: Intl.NumberFormat } = {};
export function format(num: number, decimalDigits = 0): string {
  return (formatters[decimalDigits] ?? makeFormatter(decimalDigits)).format(num);
}

function makeFormatter(decimalDigits: number) {
  formatters[decimalDigits] = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: decimalDigits
  });

  return formatters[decimalDigits];
}

export function nowPlus12Hours(): Date {
  return new Date(Date.now() + 12 * 60 * 60 * 1000);
}

export function* daysSince(year: number, month: number, day: number)
  : Generator<[number, number, number]> {
  const isLeapYear = (year: number) => year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const now = new Date();

  while (year < 2023 || month < 2 + 1 || day < 1) {
  // while (year < now.getFullYear() || month < now.getMonth() + 1 || day < now.getDate()) {
    yield [year, month, day];

    day++;
    if (day > daysPerMonth[month - 1] + (isLeapYear(year) && month == 2 ? 1 : 0)) {
      day = 1;
      month++;
      if (month > 12) {
        year++;
        month = 1;
      }
    }
  }
}
