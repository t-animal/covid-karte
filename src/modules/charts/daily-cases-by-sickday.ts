import 'moment';
import 'chartjs-plugin-zoom';

import chartjs, * as Chart from 'chart.js';

import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';
import {
  loadDailyInfections, loadDailyInfectionsOfCounty, RkiDailyNewCasesData, RkiFeatureData
} from '../data-loading';
import { countyNameById, format, getElementOrThrow } from '../helpers';
import { commonChartOptions } from './chart-options';

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
  chart?.clear();
  chart?.destroy();
  chart = renderChart(canvas, data);
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

  return new chartjs.Chart(canvas, {
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
    options: {
      tooltips: {
        mode: 'index',
        callbacks: { label: 
          (item) => {
            const label = item.datasetIndex == 0? 'Erkrankt' : 'Gemeldet';
            const value = (typeof(item.yLabel) == 'number') ? format(item.yLabel) : '??';
            return `${label}: ${value}`;
          }
        }
      },
      ...commonChartOptions(true)
    },
  });
}