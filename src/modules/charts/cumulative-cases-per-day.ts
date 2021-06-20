import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';
import {
  loadTotalCasesReportedPerDay, loadTotalCasesReportedPerDayOfCounty
} from '../data-loading';
import { RkiFeatureData, RkiTotalCasesPerDay } from '../data-loading/types';
import { countyNameById, format, getElementOrThrow } from '../helpers';
import { commonChartOptions } from './chart-options';

Chart.register(...registerables);
Chart.register(zoomPlugin);

export async function loadAndRenderCumulativeCasesPerDay(): Promise<void> {
  renderData(preprocessData(await loadData()));
}

export function reactToCountySelection(): void {
  observeCountyChanges(loadAndRenderCumulativeCasesPerDay);
}

async function loadData() {
  const countyId = selectedCountyRkiId();
  if (countyId == null) {
    return loadTotalCasesReportedPerDay();
  }
  const countyName = (await countyNameById(countyId)) ?? '';
  const countyData = await loadTotalCasesReportedPerDayOfCounty(countyName);
  return countyData;
}

function preprocessData(data: RkiFeatureData<RkiTotalCasesPerDay>) {
  const sortedValues = [...data.features.map(feature => feature.attributes)];
  sortedValues.sort((a, b) => a.Meldedatum - b.Meldedatum);

  let cumulativeTotal = 0;
  const cumulativeCasesByReportDay: {[key: string]: CumulativeCases} = {};
  for (const { Meldedatum, GesamtFaelleTag } of sortedValues) {
    cumulativeTotal = GesamtFaelleTag 
      + (cumulativeCasesByReportDay[Meldedatum]?.GesamtFaelleSeitAnfang ?? cumulativeTotal);
    cumulativeCasesByReportDay[Meldedatum] = {Meldedatum, GesamtFaelleSeitAnfang: cumulativeTotal};
  }

  return Object.values(cumulativeCasesByReportDay);
}

let chart: Chart;
function renderData(data: CumulativeCases[]) {
  const canvas = getElementOrThrow<HTMLCanvasElement>(
    '.total-reported-cases-per-day-section canvas'
  );

  chart?.clear();
  chart?.destroy();
  chart = renderChart(canvas, data);
}

type CumulativeCases = { Meldedatum: number, GesamtFaelleSeitAnfang: number };
function renderChart(canvas: HTMLCanvasElement, values: CumulativeCases[]) {
  return new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [
        {
          data: values.map(value => ({ x: value.Meldedatum, y: value.GesamtFaelleSeitAnfang })),
          borderColor: '#00c5ff',
          backgroundColor: 'rgba(0,0,0,0)',
        }
      ]
    },
    options: commonChartOptions(
      false,
      (item) =>  (typeof(item.parsed.y) == 'number') ? format(item.parsed.y) : '',
      undefined
    ),
  });
}