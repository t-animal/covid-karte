import { loadTotalCasesReportedPerDay, RkiTotalCasesPerDay } from '../data-loading';
import { getElementOrThrow } from '../helpers';
import chartjs from 'chart.js';

export async function loadAndDisplayDailyReportedInfections() {
    const data = await loadTotalCasesReportedPerDay();
    const canvas = getElementOrThrow<HTMLCanvasElement>('.newly-reported-cases-per-day-section canvas');

    const diffCasesPerDay = preprocessData(data.features.map(feature => feature.attributes));
    renderChart(canvas, diffCasesPerDay);
}

type DiffCasesPerDay = {Meldedatum: number, DiffFaelleTag: number};

function preprocessData(values: RkiTotalCasesPerDay[]) {
    const sortedValues = [...values];
    sortedValues.sort((a,b) => a.Meldedatum - b.Meldedatum);

    let lastDaysTotal = 0;
    const onlyChanges: DiffCasesPerDay[] = [];
    for(const {Meldedatum, GesamtFaelleTag} of sortedValues) {
        onlyChanges.push({Meldedatum, DiffFaelleTag: GesamtFaelleTag - lastDaysTotal});
        lastDaysTotal = GesamtFaelleTag;
    }
    return onlyChanges;
}

function renderChart(canvas: HTMLCanvasElement, values: DiffCasesPerDay[]) {
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
                    data: values.map(value => ({x: value.Meldedatum, y: value.DiffFaelleTag})),
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