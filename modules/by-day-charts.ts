import { getElementOrThrow } from './helpers';

import 'moment';
import 'chartjs-plugin-zoom';
import chartjs from 'chart.js';
import { loadDailyInfections, RkiFeatureData, RkiDailyNewCasesData } from './data-loading';
import { loadAndDisplayDataAge } from './data-age';

type PreprocessedData = {
    casesByFirstSickday: {x: number, y: number}[],
    casesByNotificationday: {x: number, y: number}[]
};

export async function loadAndDisplayDailyInfections() {
    const data = await loadDailyInfections();

    const values = preprocessData(data);

    const canvs = getElementOrThrow<HTMLCanvasElement>('canvas');
    renderChart(canvs, values);
}

function renderChart(canvas: HTMLCanvasElement, values: PreprocessedData) {
    const panZoomSettings = {
        enabled: true,
        rangeMin: {x: new Date(2020, 2)},
        rangeMax: {x: new Date()},
        mode: 'x'
    };

    const commonAxisSettings = {
        stacked: true,
        gridLines: {
            color: 'rgba(255, 255, 255, 0.1)',
            borderDash: [5]
        }
    };

    const commonDatasetSettings = {
        stack: 'stack0',
        borderWidth: 0,
        barPercentage: 1,
        categoryPercentage: 1,
    };

    return new chartjs.Chart(canvas, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Erkrankungsdatum ',
                    data: values.casesByFirstSickday,
                    backgroundColor: '#004da8',
                    ...commonDatasetSettings
                },{
                    label: 'Meldedatum ',
                    data: values.casesByNotificationday,
                    backgroundColor: '#f5bd45',
                    ...commonDatasetSettings
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
            }
        },
    });
}

function preprocessData(data: RkiFeatureData<RkiDailyNewCasesData>) {
    const labels = new Set<number>();
    const casesByFirstSickday: {[key: number]: number} = {};
    const casesByNotificationday: {[key: number]: number}  = {};

    for(const {attributes} of data.features) {
        labels.add(attributes.Refdatum);
        if(attributes.IstErkrankungsbeginn === 1) {
            casesByFirstSickday[attributes.Refdatum] = attributes.GesamtFaelle;
        } else {
            casesByNotificationday[attributes.Refdatum] = attributes.GesamtFaelle;
        }
    }

    const sortedLabels = Array.from(labels);
    sortedLabels.sort((a,b) => a-b);

    const values: PreprocessedData = {casesByFirstSickday: [], casesByNotificationday: []};
    for(const label of sortedLabels) {
        values.casesByFirstSickday.push({x: label, y: casesByFirstSickday[label] ?? 0 });
        values.casesByNotificationday.push({x: label, y: casesByNotificationday[label] ?? 0 });
    }

    return values;
}