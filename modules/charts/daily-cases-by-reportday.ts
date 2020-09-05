import chartjs from 'chart.js';

import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';
import {
  loadTotalCasesReportedPerDay, loadTotalCasesReportedPerDayOfCounty, RkiFeatureData,
  RkiTotalCasesPerDay
} from '../data-loading';
import { countyNameById, format, getElementOrThrow } from '../helpers';

export async function loadAndRenderDailyCasesByReportday(): Promise<void> {
  renderData(await loadData());
}

export function reactToCountySelection(): void {
  observeCountyChanges(loadAndRenderDailyCasesByReportday);
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

let chart: Chart;
function renderData(data: RkiFeatureData<RkiTotalCasesPerDay>) {
  const canvas = getElementOrThrow<HTMLCanvasElement>(
    '.newly-reported-cases-per-day-section canvas'
  );

  chart?.clear();
  chart?.destroy();
  chart = renderChart(canvas, data.features.map(feature => feature.attributes));
}

function renderChart(canvas: HTMLCanvasElement, values: RkiTotalCasesPerDay[]) {
  const panZoomSettings = {
    enabled: true,
    rangeMin: { x: new Date(2020, 2) },
    rangeMax: { x: new Date() },
    mode: 'x'
  };

  const commonAxisSettings = {
    gridLines: {
      color: 'rgba(255, 255, 255, 0.1)',
      borderDash: [5]
    }
  };

  return new chartjs.Chart(canvas, {
    type: 'bar',
    data: {
      datasets: [
        {
          data: values.map(value => ({ x: value.Meldedatum, y: value.GesamtFaelleTag })),
          borderColor: '#2f52a0',
          backgroundColor: '#2f52a0',
        }
      ]
    },
    options: {
      legend: { display: false, },
      tooltips: {
        callbacks: { label:  (item) => {
          return (typeof(item.yLabel) == 'number') ? format(item.yLabel) : ''; }
        }
      },
      animation: { duration: 0 },
      scales: {
        xAxes: [{
          type: 'time',
          time: { unit: 'month', },
          ticks: { min: '2020-03' },
          ...commonAxisSettings
        }],
        yAxes: [commonAxisSettings]
      },
      plugins: {
        zoom: {
          pan: panZoomSettings,
          zoom: panZoomSettings
        }
      },
      responsive: true,
      maintainAspectRatio: false
    },
  });
}