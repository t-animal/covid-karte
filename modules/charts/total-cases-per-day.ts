import { loadTotalCasesReportedPerDay, RkiTotalCasesPerDay } from '../data-loading';
import { getElementOrThrow } from '../helpers';
import chartjs from 'chart.js';

export async function loadAndDisplayTotalReportedCasesPerDay() {
    const data = await loadTotalCasesReportedPerDay();
    const canvas = getElementOrThrow<HTMLCanvasElement>('.total-reported-cases-per-day-section canvas');

    const processedData = preprocessData(data.features.map(feature => feature.attributes));
    renderChart(canvas, processedData);
}

type CumulativeCases = {Meldedatum: number, GesamtFaelleSeitAnfang: number};

function preprocessData(values: RkiTotalCasesPerDay[]) {
    const sortedValues = [...values];
    sortedValues.sort((a,b) => a.Meldedatum - b.Meldedatum);

    let cumulativeTotal = 0;
    const onlyChanges: CumulativeCases[] = [];
    for(const {Meldedatum, GesamtFaelleTag} of sortedValues) {
        cumulativeTotal = GesamtFaelleTag + cumulativeTotal;
        onlyChanges.push({Meldedatum, GesamtFaelleSeitAnfang: cumulativeTotal});
    }
    return onlyChanges;
}

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