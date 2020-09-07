import chartjs from 'chart.js';

import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';
import {
  loadTotalCasesReportedPerDay, loadTotalCasesReportedPerDayOfCounty, RkiFeatureData,
  RkiTotalCasesPerDay
} from '../data-loading';
import { countyNameById, format, getElementOrThrow, nowPlus12Hours } from '../helpers';

export async function loadAndRenderDailyCasesByReportday(): Promise<void> {
  renderData(preprocessData(await loadData()));
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

function preprocessData(data: RkiFeatureData<RkiTotalCasesPerDay>) {
  const isNew = (data: RkiTotalCasesPerDay) => data.NeuerFall === 1;

  const existingDataByReportDay: {[key: number]: RkiTotalCasesPerDay} = {};
  const newDataByReportDay: {[key: number]: RkiTotalCasesPerDay} = {};

  const dataAttributes = data.features.map(feature => feature.attributes);
  for(const attributes of dataAttributes) {
    if(isNew(attributes)) {
      newDataByReportDay[attributes.Meldedatum] = attributes;
    }else{
      existingDataByReportDay[attributes.Meldedatum] = attributes;
    }
  }

  const allReportdays = dataAttributes.map(({Meldedatum}) => Meldedatum);
  for(const reportDay of allReportdays) {
    const noCasesEntry = {Meldedatum: reportDay, GesamtFaelleTag: 0, NeuerFall: null};
    newDataByReportDay[reportDay] = newDataByReportDay[reportDay] ?? noCasesEntry;
    existingDataByReportDay[reportDay] = existingDataByReportDay[reportDay] ?? noCasesEntry;
  }

  const processedData = {
    preExist: Object.values(existingDataByReportDay),
    new: Object.values(newDataByReportDay)
  };

  processedData.preExist.sort((a,b) => a.Meldedatum - b.Meldedatum);
  processedData.new.sort((a,b) => a.Meldedatum - b.Meldedatum);

  return processedData;
}

type PreprocessedData = {preExist: RkiTotalCasesPerDay[], new: RkiTotalCasesPerDay[]};

let chart: Chart;
function renderData(data: PreprocessedData) {
  const canvas = getElementOrThrow<HTMLCanvasElement>(
    '.newly-reported-cases-per-day-section canvas'
  );

  chart?.clear();
  chart?.destroy();
  chart = renderChart(canvas, data);
}

function renderChart(canvas: HTMLCanvasElement, values: PreprocessedData) {
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
    },
    stacked: true
  };

  const commonDatasetSettings = {
    stack: 'stack0',
    borderWidth: 0,
    barPercentage: 1,
    categoryPercentage: 1,
  };

  console.log(values);

  return new chartjs.Chart(canvas, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Zuletzt',
          data: values.preExist.map(value => ({ x: value.Meldedatum, y: value.GesamtFaelleTag })),
          borderColor: '#00c5ff',
          backgroundColor: '#00c5ff',
          ...commonDatasetSettings
        },
        {
          label: 'Neu',
          data: values.new.map(value => ({ x: value.Meldedatum, y: value.GesamtFaelleTag })),
          borderColor: '#e69800',
          backgroundColor: '#e69800',
          ...commonDatasetSettings
        }
      ]
    },
    options: {
      legend: { display: false, },
      tooltips: {
        callbacks: { label:  
          (item) => {
            const label = item.datasetIndex == 0? 'Bis gestern übermittelt' : 'Gestern übermittelt';
            const value = (typeof(item.yLabel) == 'number') ? format(item.yLabel) : '??';
            return `${label}: ${value}`;
          }
        }
      },
      animation: { duration: 0 },
      scales: {
        xAxes: [{
          type: 'time',
          time: { unit: 'month', },
          ticks: { 
            min: '2020-03',
            max: nowPlus12Hours(),
          },
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