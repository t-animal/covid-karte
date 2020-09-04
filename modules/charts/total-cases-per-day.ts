import { loadTotalCasesReportedPerDay, RkiTotalCasesPerDay, RkiFeatureData, loadTotalCasesReportedPerDayOfCounty } from '../data-loading';
import { getElementOrThrow, countyNameById } from '../helpers';
import chartjs from 'chart.js';
import { observeCountyChanges, selectedCountyRkiId } from '../county-selection';

export async function loadAndDisplayTotalReportedCasesPerDay() {
    renderData(preprocessData(await loadData()));
}

export function reactToCountySelection() {
    observeCountyChanges(loadAndDisplayTotalReportedCasesPerDay);
}

async function loadData() {
    const countyId = selectedCountyRkiId();
    if(countyId == null) {
        return loadTotalCasesReportedPerDay();
    }
    const countyName = (await countyNameById(countyId)) ?? '';
    const countyData = await loadTotalCasesReportedPerDayOfCounty(countyName);
    return countyData;
}

function preprocessData(data: RkiFeatureData<RkiTotalCasesPerDay>) {
    const sortedValues = [...data.features.map(feature => feature.attributes)];
    sortedValues.sort((a,b) => a.Meldedatum - b.Meldedatum);

    let cumulativeTotal = 0;
    const onlyChanges: CumulativeCases[] = [];
    for(const {Meldedatum, GesamtFaelleTag} of sortedValues) {
        cumulativeTotal = GesamtFaelleTag + cumulativeTotal;
        onlyChanges.push({Meldedatum, GesamtFaelleSeitAnfang: cumulativeTotal});
    }
    return onlyChanges;
}

let chart: Chart;
function renderData(data: CumulativeCases[]){
    const canvas = getElementOrThrow<HTMLCanvasElement>('.total-reported-cases-per-day-section canvas');

    chart?.clear();
    chart?.destroy();
    chart = renderChart(canvas, data);
}

type CumulativeCases = {Meldedatum: number, GesamtFaelleSeitAnfang: number};
function renderChart(canvas: HTMLCanvasElement, values: CumulativeCases[]) {
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
        type: 'line',
        data: {
            datasets: [
                {
                    data: values.map(value => ({x: value.Meldedatum, y: value.GesamtFaelleSeitAnfang})),
                    borderColor: '#2f52a0',
                    backgroundColor: 'rgba(0,0,0,0)',
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