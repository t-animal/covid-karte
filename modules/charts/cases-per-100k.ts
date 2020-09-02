import { loadCountyData } from '../data-loading';
import { getElementOrThrow } from '../helpers';
import chartjs from 'chart.js';

export async function loadAndDisplayTotalCasesPer100kChart() {
    const data = await loadCountyData();
    const canvas = getElementOrThrow<HTMLCanvasElement>('.total-cases-per-100k-section canvas');

    const filteredData =
        data.features.map(feature => ({
            name: feature.attributes.county,
            casesPer100k: feature.attributes.cases_per_100k
        }));
    
    filteredData.sort((a,b) => b.casesPer100k - a.casesPer100k);

    renderChart(canvas, filteredData.slice(0, 20));
}

function renderChart(canvas: HTMLCanvasElement, values: {name: string, casesPer100k: number}[]) {
    const panZoomSettings = {
        enabled: true,
        rangeMin: {x: new Date(2020, 2)},
        rangeMax: {x: new Date()},
        mode: 'x'
    };

    const commonAxisSettings = {
        gridLines: {
            color: 'rgba(255, 255, 255, 0.1)',
            borderDash: [5],
        }
    };

    return new chartjs.Chart(canvas, {
        type: 'horizontalBar',
        data: {
            labels: values.map(value => value.name),
            datasets: [
                {
                    data: values.map(value => ({x: value.casesPer100k.toFixed(2), y: name})),
                    borderColor: '#2f52a0',
                    backgroundColor: '#00c5ff',
                }
            ]
        },
        options: {
            legend: { display: false, },
            animation: { duration: 0 },
            scales: {
                ticks: {
                    min: 0,
                },
                xAxes: [{
                    ticks: {
                        min: 0,
                    },
                    ...commonAxisSettings,
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