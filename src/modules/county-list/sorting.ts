import { RkiCountyFeatureAttributes } from '../data-loading';
import { getElementOrThrow } from '../helpers';
import { loadAndDisplayCountyList } from './county-list';

function asc(sortFunction: CountySortFunction): CountySortFunction {
  return (a, b) => sortFunction(a, b);
}
function desc(sortFunction: CountySortFunction): CountySortFunction {
  return  (a, b) => sortFunction(b, a);
}

type CountySortFunction = (a: RkiCountyFeatureAttributes, b: RkiCountyFeatureAttributes) => number;
const sortFunctions: CountySortFunction[] = [
  (a, b) => a.cases7_per_100k - b.cases7_per_100k,
  (a, b) => a.cases - b.cases,
  (a, b) => a.deaths - b.deaths,
  (a, b) => a.GEN < b.GEN ? -1 : 1
];

let sortFunctionToApply = sortFunctions[0];
let orderFunctionToApply = desc;

export function getSortFunction(): CountySortFunction {
  return orderFunctionToApply(sortFunctionToApply);
}

export function initCallbacks(): void {
  document
    .querySelectorAll('.county-list .sort-row td')
    .forEach((element, index) => {
      element.addEventListener('click', () => sortByCol(index));
    });
}

function sortByCol(index: number) {
  const newSortFunction = sortFunctions[index];
  if(newSortFunction === sortFunctionToApply) {
    orderFunctionToApply = orderFunctionToApply === asc ? desc : asc;
  }else {
    orderFunctionToApply = desc;
  }
  sortFunctionToApply = newSortFunction;

  getElementOrThrow('.county-list .sort-row span.sorted')
    .classList.remove('sorted', 'sorted-asc', 'sorted-desc');
  getElementOrThrow(`.county-list .sort-row td:nth-child(${index + 1}) span`)
    .classList.add('sorted', orderFunctionToApply === asc ? 'sorted-asc' : 'sorted-desc');

  loadAndDisplayCountyList();
}
