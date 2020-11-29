import { ChartOptions } from 'chart.js';

import { nowPlus12Hours } from '../helpers';

export function commonChartOptions(stacked: boolean): ChartOptions {
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
    stacked
  };

  return {
    legend: { display: false },
    animation: { duration: 0 },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'ddd DD.MM.YYYY'
        },
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
  };

}