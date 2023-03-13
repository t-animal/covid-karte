

import 'chartjs-adapter-date-fns';

import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';
import { loadDailyInfections, loadDailyInfectionsOfCounty } from '../data-loading';
import { RkiDailyNewCasesData, RkiFeatureData } from '../data-loading/types';
import { countyNameById, format, getElementOrThrow } from '../helpers';
import { commonChartOptions } from './chart-options';

Chart.register(...registerables);
Chart.register(zoomPlugin);
export async function loadAndRenderDailyCasesBySickday(): Promise<void> {
  renderData(preprocessData(await loadData()));
}

export function reactToCountySelection(): void {
  observeCountyChanges(loadAndRenderDailyCasesBySickday);
}

async function loadData() {
  const countyId = selectedCountyRkiId();
  if (countyId == null) {
    return loadDailyInfections();
  }

  const countyName = (await countyNameById(countyId)) ?? '';
  const countyData = await loadDailyInfectionsOfCounty(countyName);
  return countyData;
}

function preprocessData(data: RkiFeatureData<RkiDailyNewCasesData>) {
  const labels = new Set<number>();
  const casesByFirstSickday: { [key: number]: number } = {};
  const casesByNotificationday: { [key: number]: number } = {};

  for (const { attributes } of data.features) {
    labels.add(attributes.Refdatum);
    if (attributes.IstErkrankungsbeginn === 1) {
      casesByFirstSickday[attributes.Refdatum] = attributes.GesamtFaelle;
    } else {
      casesByNotificationday[attributes.Refdatum] = attributes.GesamtFaelle;
    }
  }

  const sortedLabels = Array.from(labels);
  sortedLabels.sort((a, b) => a - b);

  const values: PreprocessedData = { casesByFirstSickday: [], casesByNotificationday: [] };
  for (const label of sortedLabels) {
    values.casesByFirstSickday.push({ x: label, y: casesByFirstSickday[label] ?? 0 });
    values.casesByNotificationday.push({ x: label, y: casesByNotificationday[label] ?? 0 });
  }

  return values;
}

let chart: Chart;
function renderData(data: PreprocessedData) {
  const canvas = getElementOrThrow<HTMLCanvasElement>('.new-cases-per-day-section canvas');


  const options = chart?.scales.x.options;
  chart?.clear();
  chart?.destroy();
  chart = renderChart(canvas, data);
  
  if(options) {
    chart.zoom({x: 1});
    chart.scales.x.options.min = options.min;
    chart.scales.x.options.max = options.max;
    chart.update();
  }
}

type PreprocessedData = {
  casesByFirstSickday: { x: number, y: number }[],
  casesByNotificationday: { x: number, y: number }[]
};

function renderChart(canvas: HTMLCanvasElement, values: PreprocessedData) {
  const commonDatasetSettings = {
    stack: 'stack0',
    borderWidth: 0,
    barPercentage: 1,
    categoryPercentage: 1,
  };

  const isWeekend = (value: {x: number}) => new Date(value.x).getDay() % 6 == 0;

  return new Chart(canvas, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Erkrankungsdatum ',
          data: values.casesByFirstSickday,
          backgroundColor:
            values.casesByFirstSickday.map(value => isWeekend(value) ? '#344c7f' : '#2f52a0'),
          ...commonDatasetSettings
        }, {
          label: 'Meldedatum ',
          data: values.casesByNotificationday,
          backgroundColor:
            values.casesByFirstSickday.map(value => isWeekend(value) ? '#ba7f08' : '#e69800'),
          ...commonDatasetSettings
        }
      ]
    },
    options: commonChartOptions(
      true,
      (dataItem) => {
        const label = dataItem.datasetIndex == 0? 'Erkrankt' : 'Gemeldet';
        const value = (typeof(dataItem.parsed.y) == 'number') ? format(dataItem.parsed.y) : '??';
        return `${label}: ${value}`;
      },
      undefined,
    )
  });
}