import { loadTotalCasesReportedPerDay, RkiTotalCasesPerDay, loadTotalCasesReportedPerDayOfCounty, RkiFeatureData } from '../data-loading';
import { getElementOrThrow, countyNameById } from '../helpers';
import chartjs from 'chart.js';
import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';

export async function loadAndDisplayDailyReportedInfections() {
    const data = await loadTotalCasesReportedPerDay();

    renderData(data);
}

export function reactToCountySelection() {
    observeCountyChanges(async () => {
        const countyId = selectedCountyRkiId();
        if(countyId == null) {
            return loadAndDisplayDailyReportedInfections();
        }
        const countyName = (await countyNameById(countyId)) ?? '';
        const countyData = await loadTotalCasesReportedPerDayOfCounty(countyName);
        renderData(countyData);
    })
}

let chart: Chart;
function renderData(data: RkiFeatureData<RkiTotalCasesPerDay>){
    const canvas = getElementOrThrow<HTMLCanvasElement>('.newly-reported-cases-per-day-section canvas');

    chart?.clear();
    chart?.destroy();
    chart = renderChart(canvas, data.features.map(feature => feature.attributes));
}

function renderChart(canvas: HTMLCanvasElement, values: RkiTotalCasesPerDay[]) {
    const panZoomSettings = {
        enabled: true,
        rangeMin: {x: new Date(2020, 2)},
        rangeMax: {x: new Date()},
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
                    data: values.map(value => ({x: value.Meldedatum, y: value.GesamtFaelleTag})),
                    borderColor: '#2f52a0',
                    backgroundColor: '#2f52a0',
                }
            ]
        },
        options: {
            legend: { display: false, },
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